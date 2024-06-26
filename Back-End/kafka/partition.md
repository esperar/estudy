# Kafka 파티션 할당 전략

Kafka의 리밸런싱 븡식은 적극적 리밸런싱과 협력적 리밸런싱이 나뉘며 각각 4가지의 파티션 할당 종류가 존재한다.

1. 범위(Range) 파티션 할당 전략 - 적극적 리밸런싱
2. 라운드 로빈(RoundRobin) 파티션 할당 전략 - 적극적 리밸런싱
3. 스티키(Sticky) 파티션 할당 전략 - 적극적 리밸런싱
4. 협력적 스티키(CooperativeSticky) 파티션 할당 전략 - 협력적 리밸런싱


하나씩 알아보도록 하자

### 범위(Range) 파티션 할당 전략

범위 파티션 할당 전략은 카프카 `v2.4` 버전 이전에 기본으로 설정된 적극적 리밸런싱 방식의 파티션 할당 전략이다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdzHrep%2FbtsDawsTnD5%2F1HIQI79qC8TQGW95raqwx0%2Fimg.png)



범위 파티션 할당 전략은 다음과 같은 프로세스를 거친다.

1. 구독중인 파티션과 컨슈머를 순서대로 나열한다.
2. 이후 각 컨슈머가 받아야할 파티션의 수를 결정하는데, 이는 해당 토픽의 파티션 수를 컨슈머 그룹의 총 컨슈머 수로 나눈 값이다.
3. 만약 컨슈머 수와 파티션 수가 정확히 일치하게 된다면, 모든 컨슈머의 파티션을 균등하게 할당 받는다.
4. 파티션 수가 컨슈머 수로 균등하게 나누어지지 않는다면, 순서상 앞에 있는 컨슈머들이 추가로 파티션을 더 할당 받게 된다.

**위 그림에서 각 토픽에 존재하는 파티션이 수는 2개 컨슈머는 3개다 따라서 2를 3로 나눈 값 2/3이 되어 한 컨슈머는 파티션을 할당받지 못한다.**

이 전략의 큰 장점 중 하나는 특정 도메인에 대한 데이터 처리를 한 컨슈머에서 일관되게 관리할 수 있다는 점이다. 예를 들어서, 실시간 로그 분석 시스템에서 토픽 a가 로그 데이터를 b가 에러 정보를 관리하는 경우를 생각했을 때, 레인지 전략을 사용하면 동일한 파티션 번호를 가진 두 종류의 데이터가 동일한 컨슈머로 할당된다.

이렇게 되면, 한 컨슈머 내에서 로그 데이터와 그에 대한 에러 정보를 함께 처리하고 분석할 수 있어, 데이터의 일관성을 유지하면서 처리 효율성을 높일 수 있다.



### 라운드 로빈 파티션 할당 전략

적극적 리밸런싱 방식의 파티션 할당 전략중 하나로, **파티션을 컨슈머 그룹의 모든 컨슈머에게 균등하게 분배하는 방식이다.**

레인지와 마찬가지로 파티션과 컨슈머는 할당 전에 사전식 순서로 정렬된다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdnerLh%2FbtsC6UIhRJH%2FghmxyleQX0etDbMzEAht70%2Fimg.png)
![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdnerLh%2FbtsC6UIhRJH%2FghmxyleQX0etDbMzEAht70%2Fimg.png)

장점으로는 모든 사용 가능한 컨슈머를 효과적으로 활용하고 성능을 향상시키는 데 있다.

즉. 모든 컨슈머가 균등하게 작업을 분산받아 처리하게 되므로, 효율적인 리소스 활용이 가능하다.

**그러나 이 전략의 주요 단점은 컨슈머 수가 변경될 때(즉, 리밸런싱이 발생할 때) 파티션 이동을 최소화하려는 시도를 하지 않는다.** 라는 점이다. 예를 들어서 특정 컨슈머의 연결이 끊어지면, 할당되었던 파티션들은 다른 컨슈머들에게 재할당되어야 한다. 이러한 불필요한 파티션 이동은 컨슈머의 성능에 영향을 줄 수 있다.

위 이미지에서 컨슈머 2의 연결이 끈헝질 경우 파티션 A-1, B-0, B-1의 할당이 되는 것을 볼 수 있다.

이로 인해서 4개의 파티션 중 3개의 파티션이 다른 사용 가능한 컨슈머에게 재할당되는 상황이 발생한다.

이로 인해 불필요한 파티션 이동은 컨슈머가 새로운 파티션의 데이터를 불러오고 처리하는 데 추가적인 리소스가 소요되므로 성능에 부정적인 영향을 미친다.

<br>

### 스티키 파티션 할당 전략

적극적 리밸런싱 방식의 할당 전략중 하나로, 이 전략은 리밸런싱 작업이 필요할 때, 리밸런싱 작업이 일어나기 전의 **컨슈머의 파티션 정보를 우선적으로 매핑하여 리밸런싱 과정에서 발생할 수 있는 불필요한 파티션의 이동을 최소화한다.**

![](https://blog.kakaocdn.net/dn/bICYBw/btsC32tyfXB/TtiaTa1YtQ2Fv7KKvJe1P0/img.png)
![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcnwtxF%2FbtsDdBHtMi9%2FnbopYdBoPFvLe3saacYDIk%2Fimg.png)


이는 라운드 로빈 방식에서 일어난 불필요한 파티션 이동 문제를 개선했다.

파티션 이동을 최소화하면서도 사용 가능한 컨슈머 간에 가능한 한 균형 잡힌 할당을 유지한다.

예를 들어서, 위 이미지에서 컨슈머 2의 인스턴스가 다운되거나 실패한 경우 컨슈머 1과 컨슈머 3은 기존에 할당 받았던 파티션을 그대로 유지하고, 컨슈머 2가 가지고 있던 파티션은 새로운 컨슈머 3에게 할당된다. 이렇게 함으로써 전체를 이동하지 않고 불필요한 파티션 이동을 최소화 하여 시스템의 균형을 유지한다.

그러나 스티키 파티션 할당 전략이 항상 기존의 파티션과 컨슈머를 유지하는 것은 아니다. 이 전략의 최우선 순위는 가능한 한 균형잡힌 파티션 할당을 유지하는 것이며, 그 다음 목표가 리밸런싱이 발생할 때 기존에 할당된 파티션 정보를 최대한 유지하는 것이기 때문이다.

따라서 스티키 파티션 할당 전략은 불필요한 파티션 이동을 최소화 하려고 균형 잡힌 처리량을 유지하면서 효율적인 리밸런싱이 가능하게 한다. 이 전략이 적용되는 환경에서는 파티션의 균형과 리밸런싱 과정의 효율성이 중요한 요소가 된다.


### 협력적 스티키 파티션 할당 전략

기존의 스티키 파티션 할당 전략에 협력적 리밸런싱이라는 새로운 개념을 추가한 것이다.

이 전략은 전체 컨슈머 그룹이 아닌 개별 컨슈머에 초점을 맞춰 더욱 유연하고 효율적으로 리밸런싱한다.

협력적 리밸런싱은 리밸런싱이 필요한 특정 파티션에만 집중하며, 그 외의 나머지 파티션들은 그대로 유지되는 방식이다. 즉, **컨슈머 재할당이 필요한 특정 파티션의 소비만 중지하고, 다른 나머지 파티션에서는 계속해서 데이터를 소비한다.** 전체 컨슈머 그룹이 아닌 개별 컨슈머의 작업 중단 최소화로 전체적인 데이터 처리 성능에 이점이 있다.

따라서 협력적 스티키 파티션 할당 전략은 컨슈머가 재할당되지 않은 파티션을 계속 데이터를 소비할 수 있도록 지원하며, 이로 인해 리밸런싱의 영향을 최소화하면서 효율적인 리밸런싱이 가능하다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbkpvOy%2FbtsC6p9FRGi%2F2hBrcRlPP9lsh4HyS4MQHK%2Fimg.png)

**컨슈머 그룹의 구성 변경이 자주 발생하는 환경에서 특히 유용하며 컨슈머의 추가나 제거 또는 파티션의 재할당이 필요한 상황에서도 이 전략을 빠르게 적응하여 효율적인 리밸런싱을 수행한다.**

또한 `동적 멤버쉽` `정적 멤버쉽`을 모두 지원하며 애플리케이션의 요구사항에 따라서 컨슈머 그룹의 구성을 동적으로 유연하게 조정할 수 있다.

이 모든 특성들을 통해 협력적 스티키 파티션 할당 전략은 리밸런싱 과정에서의 데이터 처리 지연을 최소화하며, 빠르고 효율적인 리밸런싱을 가능하게 하여 전체적인 컨슈머 그룹의 성능 향상과 안정성을 지원합니다.