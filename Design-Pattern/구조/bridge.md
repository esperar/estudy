# 브리지 패턴

**브리지 패턴**은 큰 클래스 또는 밀접하게 관련된 클래스들의 집합을 두 개의 개별 계층구조(추상화 및 구현)로 나눈 후 각각 독립적으로 개발할 수 있도록 하는 구조 디자인 패턴이다.

## 구조

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F999CAD3359C4C45D24)

### Abstraction
기능 계층의 최상위 클래스로 구현 부분에 해당하는 클래스를 인스턴스를 가지고 해당 인스턴스를 통해 구현부분의 메서드를 호출한다.

### RefindAbstraction
기능 계층에서 새로운 부분을 확장한 클래스다.

### Implementor 
Abstraction의 기능을 구현하기 위한 인터페이스 정의다.

### ConcreteImplementor
실제 기능을 구현한다.