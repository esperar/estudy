# 애그리거트와 트랜잭션 관리

## 애그리거트와 트랜잭션

> 두 사용자가 한 애그리거트를 동시에 변경할 때 일관성이 깨지게 된다.

![](https://camo.githubusercontent.com/1124c1bd5bbab6af788f0aa4c2830cc5a178271920961ad103b3fea7af7bbbb1/68747470733a2f2f333535333234383434362d66696c65732e676974626f6f6b2e696f2f7e2f66696c65732f76302f622f676974626f6f6b2d6c65676163792d66696c65732f6f2f6173736574732532462d4d35484f53747876782d4a723066715a6879572532462d4d43766b674932366a743949326d36793079332532462d4d43766c592d337357304a62645a6364664575253246382e312e706e673f616c743d6d6564696126746f6b656e3d35643530633832322d383830632d343065322d386232652d613963336330356665613365)

한 애그리거트를 두 사용자가 동시에 변경할 때 트랜잭션이 필요하다.   
운영자 스레드와 고객 스레드는 개념적으로 동일한 애그리거트지만 물리적으로 서로 다른 애그리거트 객체를 사용한다.  
이 상황에서 두 스레드는 각각 트랜잭션을 커밋할 때 수정한 내용을 DB에 반영한다.  
이 때, 애그리거트의 `일관성`이 깨지게된다.
  
일관성이 깨지는 것을 막기 위해 다음 두 가지 중 하나를 해야한다.
- 운영자가 배송지 정보를 조회하고 상태를 변경하는 동안, 고객이 애그리거트를 수정하지 못하게 막는다.
- 운영자가 배송지 정보를 조회한 이후 고객의 정보를 변경하면, 운영자 애그리거트를 다시 조회한 뒤 수정하도록 한다.

DBMS가 지원하는 트랜잭션과 함께 애그리거트를 위한 추가적인 트랜잭션 기법으로 선점(비관적) 잠금과 비선점(낙관적) 잠금이 있다.

## 선점 잠금
> 선점 잠금은 교착 상태에 빠질 위험이 있다.

선점 잠금은 **먼저 애그리거트를 구한 스레드가 애그리거트 사용이 끝날 때까지 다른 스레드가 해당 애그리거트를 수정하지 못하게 막는 방식**이다.  

![](https://camo.githubusercontent.com/e2826dc4a36497e2545e5170e64871108ea2b23a0994516b61b920b68be8d83f/68747470733a2f2f333535333234383434362d66696c65732e676974626f6f6b2e696f2f7e2f66696c65732f76302f622f676974626f6f6b2d6c65676163792d66696c65732f6f2f6173736574732532462d4d35484f53747876782d4a723066715a6879572532462d4d43766b674932366a743949326d36793079332532462d4d43766c5f632d615534446767666e64693461253246382e322e706e673f616c743d6d6564696126746f6b656e3d38663735303930392d353362352d346638342d613134302d663439363064663163326135)

스레드2는 스레드 1이 애그리거트에 대한 잠금을 해제할 때까지 블로킹이 된다.  
스레드1이 트랜잭션을 커밋한 뒤에 스레드2가 애그리거트를 구하게 되므로 스레드2는 스레드1이 수정한 애그리거트의 내용을 보게된다.  
선점 잠금은 보통 DBMS가 제공하는 행단위 잠금ㅇㄹ 사용한다.  
for update와 같은 쿼리를 사용해 특정 레코드에 한 커넥션만 접근할 수 있는 잠금장치를 제공한다.  
스프링 데이터 JPA는 @Lock 어노테이션을 사용해 잠금 모드를 지정한다.  
하이버네이트는 PESSIMISTIC_WRITE를 잠금 모드로 사용하면 for update 쿼리를 이용한다.

### 선점 잠금과 교착 상태
> 교착 상태를 주의해야 한다.

사용자 수가 많아질수록 교착 상태에 빠지는 스레드가 증가하고, 시스템은 아무것도 할 수 없는 상태가 된다.  
이를 방지하기 위해 잠금을 구할 때 최대 대기 시간을 지정해야 한다.  
javax.persistence.lock.timeout 힌트는 잠금을 구하는 대기 시간을 밀리초 단위로 지정해 예외를 발생시킨다.  
DBMS에 따라 힌트가 적용되지 않을 수 있기 때문에 관련 기능을 지원하는지 확인해야 한다.  
스프링 데이터 JPA는 @QueryHints 어노테이션을 사용해 쿼리 힌트를 지정할 수 있다.

## 비선점 잠금
> 비선점 잠금은 버전을 통해 변경 가능 여부를 확인한다.

선점 잠금으로 모든 트랜잭션 충돌 문제가 해결되는 것은 아니다.

![](https://camo.githubusercontent.com/43afa4c1129bd7dfb31a2baf916e387e12177a46ecdfd76ad5f7cbd6caca3f6a/68747470733a2f2f333535333234383434362d66696c65732e676974626f6f6b2e696f2f7e2f66696c65732f76302f622f676974626f6f6b2d6c65676163792d66696c65732f6f2f6173736574732532462d4d35484f53747876782d4a723066715a6879572532462d4d43766b674932366a743949326d36793079332532462d4d43766c636937735a4c362d44487574677276253246382e342e706e673f616c743d6d6564696126746f6b656e3d30306331326434302d356533662d343039622d383663652d393861626564306136646132)

운영자가 배송지 정보를 조회하고 배송 상태로 변경하는 사이 고객이 배송지를 변경한 상황이다.  
이처럼 동시에 접근하는 것을 막는 대신 변경한 데이터를 실제 DBMS에 반영하는 시점에서 변경 가능 여부를 확인하는 **비선점 잠금**이 필요하다.  
애그리거트 버전으로 사용할 숫자 타입 프로퍼티를 추가해야한다.  
> UPDATE aggtable SET version = version + 1, colx = ?, coly = ? WHERE aggid = ? and version = 현재 버젼  

수정할 애그리거트와 현재 애그리거트의 버전이 동일한 경우에만 쿼리가 수행된다.  
다음과 같이 수정에 성공하면 버전을 1 증가시키고, 버전 값이 다르면 수정에 실패한다.

![](https://camo.githubusercontent.com/b0e9323dc86afca80507e1538b93878a97808e786cfd680d05fb922fc4d79d64/68747470733a2f2f333535333234383434362d66696c65732e676974626f6f6b2e696f2f7e2f66696c65732f76302f622f676974626f6f6b2d6c65676163792d66696c65732f6f2f6173736574732532462d4d35484f53747876782d4a723066715a6879572532462d4d43766b674932366a743949326d36793079332532462d4d43766c666f623638377973317a56386e7872253246382e352e706e673f616c743d6d6564696126746f6b656e3d61396532656361312d306666302d343636382d383535342d633431306230616463313365)

JPA는 @Version 어노테이션을 사용해 비선점 잠금 기능을 구현할 수 있다.  
스프링의 @Transactional 어노테이션을 사용해 트랜잭션이 종료될 때 충돌이 발생하면 OptimisticLockingFailureException이 발생한다.  
처음 충돌 문제가 발생했던 상황에 비선점 잠금을 적용하면 다음과 같은 흐름으로 이루어지게 된다.

![](https://camo.githubusercontent.com/583611f1eccee3f2de4c894a23a538b752a9159243ab17d8f52c884bd13e088f/68747470733a2f2f333535333234383434362d66696c65732e676974626f6f6b2e696f2f7e2f66696c65732f76302f622f676974626f6f6b2d6c65676163792d66696c65732f6f2f6173736574732532462d4d35484f53747876782d4a723066715a6879572532462d4d43766b674932366a743949326d36793079332532462d4d43766c6c6150573445304c6e416d69543573253246382e362e706e673f616c743d6d6564696126746f6b656e3d36643836323837662d386366632d343535642d383733632d353461373161323661313133)

```java
@Controller
public class OrderAdminController {
	private StartShippingService startShippingService;

	@RequestMapping(value = "/startShipping", method = RequestMethod.POST)
	public String startShipping(StartShippingRequest startReq) {
		try {
			startShippingService.startShipping(startReq);
			return "shippingStarted";
		} catch(OptimisticLockingFailureException | VersionConflicException ex) {
			// 트랜잭션 충돌
			return "startShippingTxConflict";
		}
	}
	... 
```

다음 코드는 스프링 프레임워크가 발생시키는 OptimisticLockingFailureException과 응용 서비스에서 발생시키는 VersionConflicException을 처리하고 있다.  
VersionConfilcException은 이미 누군가가 애그리거트를 수정했다는 것을 의미하고, OptimisticLockingFailureException은 누군가가 거의 동시에 수정했다는 것을 의미한다.

## 강제 버전 증가
JPA는 애그리거트 루트가 아닌 다른 엔티티가 변경되었을 때 루트 엔티티 자체의 값은 바뀌지 않으므로 버전 값을 갱신하지 않는다.  
하지만 애그리거트 관점에서 보앗을 때 애그리거트의 구성요소가 바뀌면 논리적으로 애그리거트도 바뀐 것이다.  
  
JPA는 이러한 문제를 처리하기 위해 조회 퀴리를 수행할 때 LockModeType.OPTIMISTIC_FORCE_INCREMENT를 사용해 트랜잭션 종료 시점에 버전 값 증가 처리를 한다.

## 오프라인 선점 잠금
> 오프라인 선점 잠금 방식은 누군가 수정 화면을 보고 있을 때 수정 화면 자체를 실행하지 못하게 막는다.

엄격하게 데이터 충돌을 막기 위해 누군가 수정 화면을 보고 있을 때 수정 화면 자체를 실행하지 못하게 하는 것이 **오프라인 선점 잠금 방식**이다.  
한 트랜잭션 범위에서만 적용되는 선점 잠금 방식이나 나중에 버전 충돌을 확인하는 비선점 잠금 방식으로 구현할 수 없다.

![](https://camo.githubusercontent.com/533d638e8146b288ef7afc3df73bb7b37cf6b1a2abc38b30e7be679a5da0ae3c/68747470733a2f2f333535333234383434362d66696c65732e676974626f6f6b2e696f2f7e2f66696c65732f76302f622f676974626f6f6b2d6c65676163792d66696c65732f6f2f6173736574732532462d4d35484f53747876782d4a723066715a6879572532462d4d43766b674932366a743949326d36793079332532462d4d43766c694e37554e5031344f687530474a7a253246382e382e706e673f616c743d6d6564696126746f6b656e3d32303139323164382d646439302d343035342d383064632d663061346161303739656363)

만약 이런 상황에서 사용자 A가 수정 요청을 수행하지 않는다면 잠금이 해제되지 않으므로 잠금 유효 시간을 가져야 한다.  
  
잠금 유효 시간이지나면 잠금을 해제해 다른 사용자가 잠금을 다시 구할 수 있도록 해야한다.  
  
하지만 유효 시간이 지난 뒤 얼마 되지 않아 수정 요청을 수행한다면 실패하게 된다.  
  
이를 방지하기 위해 일정 주기로 유효 시간을 증가시키는 방식이 필요하다.

## 오프라인 선점 잠금을 위한 LockManager 인터페이스와 관련 클래스
- 잠금 선점 시도
- 잠금 확인
- 잠금 해제
- 잠금 유효시간 연장

```java
public interface LockManager {
  LockId tryLock(String type, String id) throws LockException;  // 잠금 선점 시도
  void checkLock(LockId lockId) throws LockException;   // 잠금 확인
  void releaseLock(LockId lockId) throws LockException;   // 잠금 해제
  void extendLockExpiration(LockId lockId, long inc) throws LockException;  // 락 유효 시간 연장
}
```

잠금을 선점한 이후에 실행하는 기능은 다음과 같은 상황을 고려해 잠금이 유효한지 확인해야 한다.
- 잠금의 유효시간이 지났으면 아마 다른 사용자가 잠금을 선점한다.
- 잠금을 선점하지 않은 사용자가 기능을 실행했다면 기능 실행을 막아야한다.

## DB를 이용한 LockManager 구현
잠금 정보를 저장하기 위한 테이블 생성 쿼리
```sql
create table locks (
  `type` varchar(255),
  id varchar(255),
  lockid varchar(255),
  expiration_time datetime,
  primary key (`type`, id)
) character set utf8;

create unique index locks_idx ON locks (lockid);
```