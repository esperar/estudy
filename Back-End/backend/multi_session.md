# 다중 환경에서 세션은 어떻게 공유하고 관리할까?


![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdBEVdk%2FbtqESXKZqyy%2F4SA9mg3L9LwKPCbSkGm5vK%2Fimg.png)

다음과 같이 멀티 서버 환경에서 세션이 구성되어 있다.

세션은 서버 1대당 하나의 저장소가 형성된다. 지난 시간에 알아보았듯이 나누어진 세션 저장소에 대한 별도의 처리가 없다면, 각각의 세션들은 정합성 이슈를 발생시킵니다.

위 그림처럼 여러 대로 나뉜 서버가 하나의 서비스를 운영하기 위해서는 4개의 분리된 세션을 하나의 시스템처럼 동작하거나 고정된 세션을 사용해야합니다.

### Sticky Session

Sticky Session은 말 그대로 고정된 세션을 의미합니다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FboFlh4%2FbtqESXc9LPa%2Fc6j2klIYPLK1ni9QAmXLUk%2Fimg.png)

예를들어 user1이 1번부터 3번까지의 서버 중 1번 서버에 세션을 생성했다면, 이후 User1이 보내는 모든 요청은 1번 서버로만 보내집니다. 로드 밸런서는 유저가 첫 번째 세션을 생성한 서버로 모든 요청을 리다이렉트 하여 고정된 세션만 이용하게 합니다.

이를 위해 로드밸런서는 **요청을 받으면 가장 먼저 요청에 쿠키가 존재하는지 확인합니다. 쿠키가 있으면 해당 요청이 쿠키에 지정된 서버로 전송됩니다.** 쿠키가 없는 경우에는 로드밸런서가 기존 로드밸런싱 알고리즘을 기반으로 서버를 선정합니다.

동일한 사용자가 계속 해당 서버에 요청을 보낼 수 있도록 지속적으로 서버 정보가 쿠키를 통해 응답에 삽입되어 보내집니다.

이러한 방식은 유저 세션이 유지되는 동안 동일한 서버만 사용하기 때문에 정합성 이슈에서 자유로워 집니다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FlaJ6c%2FbtqETl5WCNm%2FngXl4OR3XvH4HDKbThLBrK%2Fimg.png)

그러나, 아래 그림처럼 서비스 중에 하나라도 장애가 발생하면 해당 서비스를 사용하는 모든 유저들은 세션 정보를 잃어버리게 되므로, 가용성이 떨어집니다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb8YE8A%2FbtqESWZEy7C%2FOzLcVq3gCq1462GKrWz4S0%2Fimg.png)

스티키 세션을 사용하면 정합성 이슈는 해결해도, 스케일 아웃의 장점인 가용성과 트래픽 분산을 완벽하게 사용할 수 없게 됩니다.

어떻게 하면 정합성 이슈를 해결하고, 가용성과 트래픽 분산까지 확보할 수 있는 세션 관리 방식은 없을까요? 지금부터 이를 고려한 세션 클러스터링 방식에 대해서 알아보겠습니다.

<br>

### Tomcat으로 알아보는 세션 클러스터링

여러 대의 컴퓨터들이 연결되어 하나의 시스템처럼 동작하도록 하는 것이 **클러스터링**이라고 합니다. 서버 또한 컴퓨터로써 여러 대가 하나의 서비스를 하기 위해 클러스터링 하는 것이 필요합니다.

Tomcat에서는 세션 클러스터링 구현 방법으로 `DeltaManager`를 활용한 all-to-all 복제 방식을 제안합니다.

#### all-to-all Session Replication

all-to-all 세션 복제란 하나의 세션 저장소에 변경되는 요소가 발생하면 변경된 사항이 모든 세션에 복제가 되는 것을 의미합니다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbeH7KU%2FbtqESih0Ula%2F6QwZUMToYxOh8j1LLIwYdK%2Fimg.png)

그림과 같이 세션을 복제한다면 유저가 이후에 어떤 서버에 접속하더라도 로그인 정보가 세션에 복제되어 있으므로 정합성 이슈가 해결 가능합니다. 이로써 서버 하나에 장애가 발생하더라도 서비스는 중단되지 않고 운영이 가능합니다. 하지만 톰캣의 all-to-all 세션 복제 방식은 고려해야할 단점들이 존재합니다.

우선, 모든 서버가 동일한 세션 객체를 가져야하기 때문에 많은 메모리가 필요합니다.

또한 세션 저장소에 데이터가 저장될 때마다 모든 서버에 값을 입력해야 하므로 서버 수에 비례하여 네트워크 트래픽이 증가하는 등 성능 저하가 발생하게 됩니다.

그러므로 해당 방식은 소규모 클러스터에게 좋은 효율을 보여줍니다. 4개 이상의 서버를 가진 대규모 클러스터들에게는 추천하지 않는 방식입니다.

all-to-all 세션 방식 복제 방식을 사용하면서 발생하는 스케일 아웃의 한계를 해결하는 방법은 없을까요?

**Tomcat은 `BackupManager` 를 활용한 primary-secondary** 세션 복제 방식을 제시합니다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FB8Hzk%2FbtqE6xL36i3%2FSUiyun3l639PQMzYvkgTTK%2Fimg.png)

그림과 같이 Primary 서버는 Secondary(Backup) 서버의 세션 객체의 key-value 전체를 복제합니다.하지만, 이외의 서버는 key에 해당하는 JSESSION ID만 복제하기 때문에 메모리 사용이 all-to-all 방식보다 줄어들게 됩니다. 세션 객체 전체를 복제하는 시간보다 key만 복제하는 것이 상대적으로 시간이 절약될 것 입니다.

그러므로 이러한 방식은 4대 이상의 대규모 클러스터에서 사용이 용이합니다.

그럼에도 불구하고 아직 문제점은 존재하는데 세션을 복제하는데 걸리는 시간은 줄일 수 있으나, primary, secondary 서버를 제외한 **proxy 서버에 세션 정보를 요청할 경우 다시 primary 서버에 요청하여 해당 키에 해당하는 객체를 받아와야합니다.** 

이처럼 세션 클러스터링은 정합성 이슈는 해결하지만, 성능적인 한계가 존재합니다. 이 두가지 방식을 보완하여 다중 서버에서 세션을 공유하는 방법은 무엇이 있을까요?

<br>

### 세션 스토리지 분리를 통해 Scale Out시 발생하는 정합성 이슈 해결

세션 스토리지를 분리한다는 것은 어떤 것일까요? 이는 기존 서버가 갖고 있는 로컬 세션 저장소를 이용하는 것이 아니라, 별도의 세션 저장소를 사용하는 것을 의미합니다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcvGZ64%2FbtqESWyzU7U%2FwPLINLrekwoSehSrteRLa0%2Fimg.png)

이렇게 세션스토리지가 분리되면 서버가 아무리 늘어나도 세션 스토리지에 대한 정보만 각각의 서버에 입력해주면 세션이 공유가 됩니다.

이러한 방식을 사용한다면 로드밸런싱 알고리즘만 잘 구현되어있는 가정 하에 스트키 세션처럼 트래픽이 비정상적으로 몰리는 현상을 고려하지 않아도 됩니다.

또한 서버가 장애가 발생해도 별도의 세션 저장소가 존재하기에 서비스를 계속 제공하여 가용성 확보까지 가능합니다.

뿐만 아니라 근본적으로 해결하려던 정합성 문제도 해결할 수 있습니다. 여러 대의 서버가 하나의 세션을 사용하기 때문에 기존에 개별적으로 갖고 있던 로컬 세션 저장소의 데이터 불일치가 발생하지 않기 때문입니다.

무엇보다도 세션 저장소가 하나이기 때문에 데이터 정합성 해결을 위한 별도의 세션 복제를 할 필요가 없어서 이에 대해서는 성능적인 문제 해결도 가능합니다.

단, 세션 저장소도 세션 객체를 복제할 필요가 있는데요, 이는 데이터 정합성 문제를 해결하기 위한 것이 아니라, 세션 저장소를 운영한다는 것은 해당 서버가 SPOF가 될 수 있기 때문에 모든 세션을 사용할 수 없다는 문제를 해결하기 위해서 입니다.