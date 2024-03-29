# Spring AOP와 다이나믹 프록시를 사용해 트랜잭션 분리하기

### **프록시 패턴이란?**

- 요청을 대신 받아 부가기능을 처리한 후 타깃(비즈니스 로직)에게 핵심 기능을 위임해주는 디자인 패턴이다.

<br>

### **데코레이터 패턴이란?**

- 동적으로 기능을 추가, 변경할 수 있는 디자인 패턴이다. 클라이언트는 관련 기능을 원하는데로 사용할 수 있다.

예시로는 InputStream이 있다. `BufferdInputStream(new FileInputStream(”a.txt”))`

<br>

### **프록시 패턴을 사용해서 트랜잭션이랑 비즈니스 로직 책임 분리하기 + 문제점**

유저 서비스가 있고 그곳엔 트랜잭션을 관리하는 로직과 비즈니스 로직이있다. 있다고하자. 한 곳에 비즈니스 로직과 트랜잭션이 몰려있는데 이를 해결하기 위해 트랜잭션을 처리하는 클래스를 생성한 후 유저 비즈니스 서비스를 DI받고 트랜잭션 작업을 비즈니스 작업이 수행되기 전 처리한 후 비즈니스 로직을 위임시켜 해결할 수 있다

여기서 문제점은 각 비즈니스 로직이 있는 서비스 클래스마다 프록시 클래스를 만들어야한다는 문제가 있다.

<br>

### **중복된 코드를 해결하기 위해서는? InvocationHandler + 문제점**

> 위에서, 서비스 클래스마다 프록시 클래스를 만들어야한다는 문제가 있다.
> 

라는 문제를 해결하기 위해 자바 리플렉션 기능 중 **다이나믹 프록시**를 사용하여 문제를 해결할 수 있다. 자바 리플랙신 기능중 InvocationHandler가 있으며 그 클래스를 구현한다. invoke()라는 함수를 오버라이딩해 부가기능(여기서는 트랜잭션이라 볼 수 있음)을 추가하고 관련 부가기능이 추가될 객체에게 적용한다.  

`Proxy.newInstance(ClassLoader, Class, Target);`을 통해서 관련 부가기능이 추가된 객체를 생성할 수 있는데 이 방법 외에는 관련 객체를 빈으로 등록할 수 없다.라는 문제가 발생한다.

<br>

### FactoryBean란?, 그리고 왜 필요한지 + 문제점

> 위에서, `Proxy.newInstance(ClassLoader, Class, Target);`을 통해서 관련 부가기능이 추가된 객체를 생성할 수 있는데 이 방법 외에는 **관련 객체를 빈으로 등록할 수 없다.**라는 문제가 발생한다. 라는 문제가 있다.
> 

이 문제를 해결하기 위해서는 FactoryBean라는 것을 사용해서 문제를 해결해볼 수 있다. FactoryBean은 인터페이스이며 다음과 같은 메서드를 구현하도록 한다. getObject(), getObjectType(), isSingleton()

팩토리 빈은 스프링을 대신해 오브젝트를 생성하는 특별한 로직을 가지고있는 클래스다. FactoryBean을 구현한 후 빈으로 등록하면 getObject()에서 반환하는 클래스를 빈을 가져왔을때 반환한다. 쉽게 말해 팩토리빈이 가지고있는 클래스를 반환한다. 즉 UserFactoryBean을 구현한 후 빈으로 등록을 하면 User가 빈으로 등록이 되는 것이다. **그렇기에 InvocationHandler로 구현한 로직을 토대로 프록시 객체를 생성하는 로직을 팩토리빈 getObject()에 담고 팩토리빈을 빈으로 등록하면 된다.** + 추가로 팩토리빈을 가져오고싶다면 getBean(”&factoryBean”) &를 붙여주면 된다.

그러나 여기서도 문제가있는데 각 객체(서비스)마다 팩토리빈을 계속해서 생성해줘야하는 문제점이 생긴다. 그에 따라 객체를 생성하는 중복 코드가 발생하게 된다.

<br>

### ProxyFactoryBean이란, 그리고 왜 필요한지

> 위에서, 각 객체(서비스)마다 팩토리빈을 계속해서 생성해줘야하는 문제점이 생긴다. 그에 따라 객체를 생성하는 중복 코드가 발생하게 된다라는 문제가 있었다.
> 

이 문제를 해결하기위해 ProxyFactoryBean을 솔루션으로 제시할 수 있다. 프록시팩토리빈은 프록시를 생성해서 오브젝트를 빈으로 등록해주는 클래스이며 데코레이터패턴을 사용해 동적으로 어떤 빈이든 부가기능을 간편하게 빈으로 추가해줄 수 있다. ProxyFactoryBean의 Advice MethodInterceptor라는 것을 구현하며 InvocationHandler와는 다르게 타깃 객체의 상태를 알고있다 (MethodInvocation을 인자로 가지고 있음) 콜백 오브젝트로서 템플릿으로 동작하기 때문이다.

그렇기에 ProxyFactoryBean으로 유연하게 여러 객체와 어드바이스를 빈으로 추가해서 중복된 코드의 문제를 해결할 수 있다. 

마지막으로 여기에도 문제가 하나 있다. 중복된 코드는 줄였지만 프록시팩토리빈을 사용하는 서비스마다. xml, config파일에 계속 프록시팩토리빈을 정의해야하는 문제가 남아있다.

<br>

### DefaultAdvisorAutoProxyCreator란. 그리고 왜 필요한지

> 위에서, 중복된 코드는 줄였지만 프록시팩토리빈을 사용하는 서비스마다. xml, config파일에 계속 프록시팩토리빈을 정의해야하는 문제가 남아있다. 라고 언급했다.
> 

우리는 이러한 문제를 빈후처리기라는 기술을 통해서 해결해볼 수 있다. (BeanPostProcessor) 빈이 생성된 이후에 빈에 추가적인 작업을 추가하는 기술 그리고 대표적으로 DefaultAdvisorAutoProxyCreator라는 클래스가 있다.

그렇게 Advisor를 여럿을 적절한 Pointcut에 적용시켜주기위해 AspectJExpressionPointcut 클래스를 사용해 포인트컷 표현식을 통해 유연하게 원하는 부가기능들을 적절한 Pointcut(적용 시킬 클래스들)을 구해 부가기능들을 추가할 수 있도록 도와주는 것이 DefautAdvisorAutoProxyCreator라는 클래스다.

그렇게 적용시킬 관련 클래스들의 포인트컷을 DefaultAdvisorAutoProxyCreator과 Advisor 클래스들과 함께 빈으로 등록시키면 적용시킬 수 있다 예시로

- execution(* minus(int, int))
    - 모든 리턴타입을 허용 / minus(int, int) 함수에 대한 포인트컷을 설정한다.

여기서는 이제 Transaction과 관련한 Advice를 정의한 후 *ServiceImpl로 끝나는 클래스들에게 이 기능들을 적용하겠다 하고 등록을 해주면 비즈니스로직을 담고잇는 서비스들은 전부 트랜잭션과 관련한 기능들을 사용할 수 있습니다. 

이것이 다이나믹 프록시를 사용해 적용하는 방법입니다.