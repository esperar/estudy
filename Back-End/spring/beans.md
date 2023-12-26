# 애플리케이션 로직, 인프라 빈, 컨테이너 인프라 빈


## 빈의 종류

스프링에서 빈은 또 3가지의 종류로 구성이 된다.

- 애플리케이션 로직 빈
- 애플리케이션 인프라 빈
- 컨테이너 인프라 빈


### 애플리케이션 로직 빈
애플리케이션이 동작하면서 생성되고 소멸되는 빈이다. 기본적인 백엔드 애플리케이션에서는
서비스, 컨트롤러와 같은 컴포넌트들이 이 역할을 한다.

### 애플리케이션 인프라 빈
이 빈도 애플리케이션 생명주기에 맞춰져있지만 다른점은 외부에서 생성된 빈이라는 점이다.
예를 들면 DataSource가 있다. 

애플리케이션 인프라 빈은 애플리케이션 로직 빈의 작업 수행을 도와주는 역할을 한다.

### 컨테이너 인프라 빈
컨테이너 인프라빈은 스프링 컨테이너의 기능을 확장하여 사용되는 빈을 의미한다.
예를 들면 DefaultAdvisorAutoProxyCreator와 같은 클래스들이 있다.

이러한 클래스들은 빈 후처리와 같은 기능들을 통하여 컨테이너의 빈을 스캔하는 방법과 같이 확장된 기능들을 제공해준다.

예를들어 @Configuration 어노테이션을 달아놓은 클래스 내부에 @Bean 어노테이션으로 빈들을 정의했다고 해보자. @Configuration 어노테이션 자체가 이 빈들을 컨테이너에 등록하게 해주는 기능을 수행하는 것 같지만 그렇지 않다. 이 Configuration 클래스를 그냥 빈으로 등록하면  클래스 내부 빈들은 컨테이너에 등록되지 않는다.

그러나 스프링의 컨테이너 인프라 빈인 ConfigurationClassPostProcessor 클래스가 이 작업을 수행해준다. (xml에서는 <\annotation-config>와 같이 전용 태그로 묶어줄수도있다.)

@Autowired가 달려있는 클래스들도 마찬가지로 AutowiredAnnotationBeanPostProcessor와 같은 컨테이너 인프라 빈이 @PostConstruct도 CommonAnnotationBeanPostProcessor와 같은 컨테이너 인프라 빈들이 처리를 해준다.

