# Redis Distributed Lock, Example Spring Boot

분산락은 분산된 서버 또는 데이터베이스 환경에서도 동시성을 제어할 수 있는 방법이다. 이번에는 [[Redis]]로 분산락 솔루션으로 선택했다는 가정하에 글을 작성하겠다.

반드시 레디스를 활용할 필요는 없고 mysql에서 네임드락을 활용해 구현할 수도 있으나 redis를 사용하는 이유는 기본적으로 디스크를 사용하는 데이터베이스보다 메모리를 사용하는 레디스가 더 빠르게 락을 취득, 해제할 수 있기 때문에 redis로 동시성을 제어하려고 한다.

### Lettuce vs Redisson

Redis에서 분산락을 구현하기 위한 클라이언트로 Lettuce, Redisson이 존재한다.

Lettuce로 구현할 경우 몇가지 단점이 존재하는데 반드시 스핀락을 이용한다는 것이다. 스핀락으로 락을 획득하기 위해 `SETNX`라는 명령어를 계속해서 레디스로 request한다. 따라서 redis에 많은 부하가 가게 된다.

반면 Redisson은 pub/sub 방식을 이용하여 락이 해제되면 subscribe한 클라이언트는 락이 해제되었다는 신호를 받고 락 획득을 시도하게 된다.

Lettuce를 사용하게되면, 자체적인 타임아웃 구현이 존재하지 않아 락을 영원히 반환하지 않는다거나 락을 획득하지 못해 무한루프를 돈다거나 하는 문제가 있다. 그런 문제들을 해소하려면 애플리케이션 레벨에서 타임아웃을 구현해야하는데, 반면 Redisson은 별도의 Lock interface에서 타임아웃과 같은 설정을 지원하기에 편하게 또 안전하게 사용 가능하다.

<br>

### Example

```java
 implementation 'org.redisson:redisson-spring-boot-starter:3.30.0'
```

해당 의존성을 추가해준다. 그리고 Redis에 연결하기 위해 정의하는 프로퍼티와 config를 통해 기본적인 설정을 마쳐준다.

```java
@ConfigurationProperties(prefix = "spring.data.redis")
public record RedisProperties(
    String host,
    int port
) {

}
```

```java
@Configuration
@RequiredArgsConstructor
public class RedissonConfig {

    private static final String REDISSON_HOST_PREFIX = "redis://";
    private static final String DIVISION = ":";
    private final RedisProperties redisProperties;

    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useSingleServer().setAddress(
            REDISSON_HOST_PREFIX + redisProperties.host() + DIVISION + redisProperties.port());
        return Redisson.create(config);
    }
}
```

그리고 Redis 분산락을 적용할 메서드 위에 annotaion을 붙여주고 aop로 처리할 것이기 때문에 커스텀 어노테이션을 만들어주고 어노테이션을 읽어 부가기능을 추가할 aspect도 작성해준다.

```java
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RedissonLock {

    String value();

    long waitTime() default 5000L;

    long leaseTime() default 3000L;
}
```

```java
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class RedissonLockAspect {

    private static final String DIVISION = ":";
    private final RedissonClient redissonClient;

    @Around("@annotation(RedissonLock)")
    public Object redissonLock(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RedissonLock redissonLock = method.getAnnotation(RedissonLock.class);

        String lockKey =
            method.getName() + DIVISION + RedisLockSpELParser.getLockKey(signature.getParameterNames(),
                joinPoint.getArgs(), redissonLock.value());

        long waitTime = redissonLock.waitTime();
        long leaseTime = redissonLock.leaseTime();

        RLock lock = redissonClient.getLock(lockKey);
        boolean isLocked = false;

        try {
            isLocked = lock.tryLock(waitTime, leaseTime, MILLISECONDS);
            if (isLocked) {
                log.info("락을 얻는데 성공하였습니다. (락 키 : {})", lockKey);
                return joinPoint.proceed();
            } else {
                log.error("락을 얻는데 실패하였습니다. (락 키 : {})", lockKey);
                throw new RedisLockException(ErrorCode.REDIS_FAILED_GET_LOCK_ERROR);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("락을 얻는데 인터럽트가 발생하였습니다. (락 키 : {})", lockKey);
            throw new RedisLockException(ErrorCode.REDIS_INTERRUPT_ERROR);
        } finally {
            if (isLocked) {
                lock.unlock();
                log.info("락을 해제하는데 성공하였습니다. (락 키 : {})", lockKey);
            }
        }
    }

}
```

```java
public final class RedisLockSpELParser {

    public static Object getLockKey(String[] parameterNames, Object[] args, String key) {
        SpelExpressionParser parser = new SpelExpressionParser();
        StandardEvaluationContext context = new StandardEvaluationContext();

        for (int i = 0; i < parameterNames.length; i++) {
            context.setVariable(parameterNames[i], args[i]);
        }

        return parser.parseExpression(key).getValue(context, Object.class);
    }

}
```

acceptGroupInvite 메서드에는 @RedissonLock(value = "#groupId")만 달아주었다. 즉 타임아웃 설정은 아까 우리가 정의한 기본값으로 들어가게 된다.

여기서 주의할 점은 redis 분산락을 사용할 때는 **반드시 트랜잭션 이후 락이 해제되도록 처리해야한다.**

그 이유는 client 1에서 락을 획득중이고 client 2가 락 획득을 대기중인 상태에서는, client2가 client1의 트랜잭션이 커밋되기 전, 락을 획득할 수 있기 때문에, 데이터 정합성이 깨질 수 있어서다. -> transactionTemplate을 통해서 트랜잭션을 관리하고 있다면, 블록이 끝나고 commit이 되고 데이터를 반환한 후 lock이 해제가 될 것이다.

### Test

redis container를 띄워서 테스트해보겠다.

```java
testImplementation 'org.testcontainers:testcontainers:1.19.1'
testImplementation 'org.testcontainers:junit-jupiter:1.19.1'
testImplementation 'com.redis:testcontainers-redis:2.2.2'
```

```java
public abstract class RedissonTestContainer {

    private static final String REDIS_IMAGE = "redis:alpine";
    private static final int REDIS_PORT = 6379;
    private static final RedisContainer REDIS_CONTAINER;

    static {
        REDIS_CONTAINER = new RedisContainer(
            DockerImageName.parse(REDIS_IMAGE)).withExposedPorts(REDIS_PORT);
        REDIS_CONTAINER.start();
    }

    @DynamicPropertySource
    private static void registerRedisProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.redis.host", REDIS_CONTAINER::getHost);
        registry.add("spring.data.redis.port", () -> REDIS_CONTAINER.getMappedPort(REDIS_PORT)
            .toString());
    }
}
```

```java
@DataRedisTest
public abstract class RedissonTest extends RedissonTestContainer {

}
```

```java
@TestConstructor(autowireMode = AutowireMode.ALL)
class RedisConcurrencyTest extends RedissonTest {

    private static final int MAX_THREADS_COUNT = 10;

    private final MemberRepository memberRepository = mock(MemberRepository.class);
    private final GroupRepository groupRepository = mock(GroupRepository.class);
    private final MemberGroupRepository memberGroupRepository = mock(MemberGroupRepository.class);
    private final GroupInviteRepository groupInviteRepository = mock(GroupInviteRepository.class);
    private final SocialNotificationManager socialNotificationManager = mock(
        SocialNotificationManager.class);

    private final MemberGroupCommandService groupMemberCommandService = spy(
        new MemberGroupCommandService(
            memberRepository,
            groupRepository,
            memberGroupRepository,
            groupInviteRepository,
            TestTransactionTemplate.spied(),
            socialNotificationManager)
    );

    private final MemberGroupFacade memberGroupFacade = spy(
        new MemberGroupFacade(groupMemberCommandService, socialNotificationManager)
    );


    @Test
    void 사용자는_그룹_초대_요청을_수락할_때_레디스_분산락을_통해_동기적으로_처리한다() throws InterruptedException {
        //given
        ExecutorService executorService = Executors.newFixedThreadPool(MAX_THREADS_COUNT);
        CountDownLatch latch = new CountDownLatch(MAX_THREADS_COUNT);
        AtomicInteger countCheck = new AtomicInteger(MAX_THREADS_COUNT);

        Long memberId = 1L;
        Long groupId = 1L;

        Member groupMember = MemberFixture.member(1);

        given(groupRepository.getTotalGroupMemberCount(groupId))
            .willReturn(Optional.of(10L));
        given(memberRepository.findMemberById(memberId))
            .willReturn(Optional.of(groupMember));
        given(groupRepository.findGroupById(groupId)).willReturn(
            Optional.of(GroupFixture.group()));
        given(memberGroupRepository.findGroupOwnerId(groupId))
            .willReturn(Optional.of(2L));

        given(groupInviteRepository.deleteGroupInviteByGroupIdAndGroupOwnerIdAndGroupMemberId(
            groupId, 2L, memberId)).willReturn(1);

        //when
        for (int i = 0; i < MAX_THREADS_COUNT; i++) {
            executorService.submit(() -> {
                try {
                    memberGroupFacade.acceptGroupInvite(memberId, groupId);
                } finally {
                    latch.countDown();
                    int expectedCount = countCheck.decrementAndGet();
                    assertThat(expectedCount).isEqualTo(latch.getCount());
                }
            });
        }

        latch.await();
        executorService.shutdown();

        //then
        verify(groupInviteRepository,
            times(MAX_THREADS_COUNT)).deleteGroupInviteByGroupIdAndGroupOwnerIdAndGroupMemberId(
            anyLong(), anyLong(), anyLong());
        verify(memberGroupRepository, times(MAX_THREADS_COUNT)).save(any());
    }
```

이렇게 레디스로도 분산락을 적용하여 동시성 문제를 해결할 수도 있고, 비관적, 낙관적 락등을 적용해서 동시성 문제를 해결해볼 수 있는데 java에서는 ReentrantLock, Semaphore로도 쓰레드 락을 걸 수 있다. 애플리케이션 인스턴스가 하나 뿐이라면 오히려 이러한 방법이 더 적합할 수도 있다. 인스턴스가 다수라면 또 다를 수 있겠지만