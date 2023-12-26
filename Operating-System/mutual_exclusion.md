# 스핀락, 뮤텍스, 세마포어 + 뮤텍스 vs 이진 세마포어

### 경쟁조건(Race Condition)이란?
여러 프로세스/스레드가 동시에 같은 데이터를 조작할 때 타이밍이나 접근 순서에 따라 결과가 달라질 수 있는 상황

### 임계구역(Critical Section)이란?
경쟁조건 (Race Condition)이 발생할 수 있는 코드 / 부분 / 영역이다.

### 상호배제(Mutual Exclusion)란?
상호배제란 임계구역에서 공유 데이터 일관성을 보장하기 위해 하나의 프로세스/스레드만 진입해서 실행할 수 있도록 하는 메커니즘이다.

<br>

## 스핀락

스핀락은 CPU의 도움을 받아 lock을 확인하는 방식이다.

쉽게 말해 스레드가 락을 점유할때까지 대기하지않고 계속해서 락을 취득할 수 있는지 확인하는 방식이다.

컨텍스트 스위칭은 발생하지 않지만, CPU 연산이 많이 든다는 단점이 존재한다.

### TestAndSet 
TestAndSet이라는 CPU의 atomic 명령어를 사용한다. 

- TestAndSet은 실행 중간에 간섭받거나 중단되지 않는다.
- 같은 메모리 영역에 대해 동시에 실행되지 않는다.

<br>
## 뮤텍스
뮤텍스는 스핀락과 다르게 일단 임계 영역에 들어가기 전에 lock을 취득하는 과정을 가지고 하나의 스레드가 락을 취득하고 cirtical section에 들어가게 되고, 다른 스레드가 또 접근하게 된다면 그 스레드를 대기상태로 바꾸고 큐에 넣는다.

그리고 lock이 있는 스레드가 작업을 끝내고 lock을 반환하게 된다면 큐에 있던 다른 스레드가 락을 취득하고 작업을 수행하게 된다.

### 뮤텍스가 항상 스핀락보다 좋은가?
그건 아니다 뮤텍스는 작업 스레드를 바꿀때 컨텍스트 스위칭이 일어나게된다.

그래서 멀티 코어 환경이고 critical section에서의 작업이 컨텍스트 스위칭보다 더 빨리 끝난다면 스핀락이 뮤텍스보다 더 이점이 있긴하다.

그래도 컨텍스트 스위칭보다 critical section 작업이 빨리 끝나는 경우는 드물기때문에 왠만하면 뮤텍스를 사용한다.

<br>

## 세마포어

signal mechanism을 가진 하나 이상의 프로세스/스레드가 critical section에 접근이 가능하도록 하는 장치이다.

세마포어에서는 0, 1 뿐만 아닌 여러값들을 가질 수 있다.

세마포어의 wait에서는 현재 lock의 value -1 하고 signal을 호출하면 value +1 한다. 현재 세마포어의 value가 0 이상이라면 테스크를 실행할 수 있다.

세마포어는 순서를 정해줄 때 사용할 수 있다.

세마포어는 서로 다른 스레드/프로세스 끼리 signal을 조작할 수 있다. 


<br>

## 뮤텍스 vs 이진 세마포어

둘은 같다고 생각할 수 있지만 사실 차이점이 존재한다.

뮤텍스는 락을 가진 자만 락을 해제할 수 있지만 세마포어는 그렇지 않다.

그리고 뮤텍스는 priority inheritance 속성을 가지지만 세마포어는 그런 속성이 없다.

### priority inheritance
cpu는 작업을 수행할 때 여러 방식으로 스케쥴링을 한다.

여기서 우선순위 스케쥴링 방식을 사용할 때를 예시로 들어보자

프로세스1과 프로세스2가 있고 프로세스1의 우선순위가 더 높다고 해보자.

프로세스2가 lock을 가지고있을때 작업을 프로세스1에게 할당한다면 프로세스1은 프로세스2의 작업이 끝날때까지 대기하게된다. 

그래서 이 부분을 빠르게 해결하기 위해서 lock을 쥐고있는 프로세스의 우선순위를 올려준다.

이러한 작업이 priority inheritance라고한다.

이렇게 되면 자기가 원하는대로 우선순위를 부여해도 순서를 보장할 수 없긴하다.

그래서 세마포어를 사용하면 순서를 보장할 수 있다.

즉, 결론은

- 상호 배제만 필요하다면 뮤텍스를 사용한다.
- 작업 간의 실행 순서 동기화가 필요하다면 세마포어를 권장한다.