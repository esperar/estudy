# Java NIO - Selector

셀렉터는 하나의 스레드가 여러개의 채널을 관리할 수 있게 해주는 NIO 컴포넌트다.

NIO는 셀렉터라는 메커니즘을 제공해 하나 이상의 NIO 채널들을 모니터링하고, 데이터 전송이 가능해지는 상황을 인지할 수 있게 해준다.

Selector는 Reactor의 역할을 한다.

### Reactor
이벤트 중심의 어플리케이션이 하나 이상의 클라이언트로부터 동시에 전달되는 서비스요청들을 서비스 제공자에게 구별해서 보내주는 비블록킹 서버 구현의 밑바탕

즉, 여러 SelectableChannel을 자신에게 등록하고 등록된 SelectabelChannel의 이벤트 요청들을 적절한 서비스 제고앚에게 처리하는 멀티플렉스 IO이다.

### 멀티플렉스 IO
멀티플렉스 IO는 하나의 스레드로 동시에 많은 IO채널들을 효율적으로 관리할 수 있게 해주어, 기존의 서버보다 빠르고 많은 동시 접속자를 수용할 수 있는 확장성 서버를 만들 수 있다.

### 셀렉터를 사용하는 이유?

3개의 클라이언트 연결이 붙어 있는 서버 프로그램을 생각해보자, 서버는 3개의 소켓채널이 열려있을 것이다.

클라이언트는 자기가 보내고 싶을 때 요청을 보내기 떄문에 서버는 클라이언트의 요청을 기다려야한다.


## Creating Selector
셀렉터는 셀렉터 클래스의 정적 메서드인 `open()`을 통해 생성할 수 있다.

```java
Selector selector = Selector.open()
```

## Registering Selectable Channels
셀렉터가 채널들을 모니터링하려면 셀렉터들에게 해당 채널들을 등록시켜주여야 한다. 선택 가능한 채널의 등록 메서드를 호출해 이를 수행한다.

그러나 채널이 셀럭터에 등록되기 전에 논블로킹 상태여야 한다.

```java
channel.configureBlocking(false);
SelectionKey key = channel.register(selector, SelectionKey.OP_READ);
```

즉, FileChannel은 소켓 채널에서와 같이 비차단 모드로 전환할 수 없기 때문에 셀럭터와 함께 사용할 수 없다.

수신을 대기할 수 있는 네 가지 이벤트가 있으며, 각 이벤트는 SelectionKey 클래스에서 상수로 표현된다.

- Connect: 클라이언트가 서벙에 연결을 시도할 때 - `SelctionKey.OP_CONNECT`
- Accept: 서버가 클라이언트의 연결을 수락하는 경우 - `SelctionKey.OP_ACCEPT`
- Read: 서버가 채널에서 읽을 준비가 된 경우 - `SelctionKey.OP_READ`
- Write: 서버가 채널에 쓸 준비가 된 경우 - `SelctionKey.OP_WRITE`

