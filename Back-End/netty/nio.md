# Java NIO

Java New(or Non-Blocking) Input/Output의 약자로 자바 4부터 지원도니 생각보다 오래된 기능이며 자바 7부터는 NIO2가 지원되었다.

다음은 NIO와 이전 IO 방식의 데이터 처리 비교이다. 이전 IO는 BIO라고 칭한다.
![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FG3Y8f%2FbtqGyvZboLv%2FrbSWbT68b92WNBnWoPESDk%2Fimg.png)


## BIO
기존 자바 I/O는 가상머신의 한계로 OS의 커널 버퍼로 직접적으로 핸들링 할 수 없었다.

왜냐하면 소켓이나 파일에서 Stream이 들어오면 커널 버퍼에서 데이터를 써야하는데

당시에는 이를 코드 레벨에서 접근할 수 있는 방법이 없었기 때문이다.

그 대안으로 BIO의 경우, JVM이 커널에게 시스템 콜을 사용하게 하여 문제를 해결했다.

### 과정
JVM -> 커털 -> 시스템 콜 -> 디스크 컨트롤러 -> DMA가 커널버퍼로 복사 -> JVM 버퍼에 복사

### 문제
1. JVM으로 내부 버퍼 복사시 CPU가 관여해 오버헤드가 일어날 수 있다.
2. 복사된 버퍼는 활용 후 GC 대상이 되어 Stop-the-World로 인한 성능이 저하된다.
3. 복사중인 I/O 요청 스레드는 블로킹 상태 -? 처리속도 저하
 
특히 3번째의 블로킹 이슈가 주요 문제다. Steam은 단방향으로 읽기 때문에 읽을 때와 쓸 때 InputStream과 OutputStream으로 구분하여 사용하였고, 읽고 쓰는 작업이 다 끝날때 까지는 아무것도 할 수 없었다.

또한 자바는 C와 C++ 스레드와는 다르게 한단계의 추상화 레이어가 더 존재하기 때문에 이 둘보다 스레드 생성에 시간이 오래걸렸으며, 클라이언트가 서버에 접속 할 경우에는 앞서 접속한 클라이언트의 스레드가 다 만들어질때 까지 기다려야 했기 때문에 처리속도가 처하되었다. (그래서 스레드를 미리 만들어 pool 형식으로 사용하는것 같다.)

<br>

## NIO
자바 1.3 이후 부터 JVM에 통일된 인터페이스가 도입되어, 각 OS별 커널 버퍼에 접근 할 수 있게 되었다.  
IO와 NIO 모두 Blocking 모드를 지원하지만, 블로킹을 빠져나오기 위한 방법에는 차이가 있다.  
IO는 오직 Stream을 닫는 것으로만 블로킹을 빠져나올 수 있지만, NIO는 Selector를 통해서 이를 해결할 수 있다.

![](https://user-images.githubusercontent.com/50672087/83237115-a1054200-a1cf-11ea-9b2e-e22d3a5c5e56.png)



`java.nio.channels.Selector`는 자바상에서의 논블로킹 I/O 구현의 핵심으로써, Multiplex/IO Select와 같다.  
Select는 시스템 이벤트 통지 API를 사용하여 하나의 스레드로 동시에 많은 IO를 담당할 수 있다.

netty의 경우, 리눅스 위에서 작동할 경우, 자동적으로 Select가 아닌 Eproll을 사용한다.

**Select와 Epoll 모두 시스템 콜이다.**

간단한 차이를 설명하자면, 소켓을 열면 파일 디스크럽터라는 unsigned int 형식의 소켓 ID를 부여 한다.

Select의 경우 루프를 돌면서 파일 디스크럽터들의 변화를 감시하는 반면,

epoll은 콜백형식으로 관리한다. 즉, epoll이 더 빠르다.

 



