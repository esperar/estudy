# Spring boot 내장 웹 서버 톰캣과 다른 내장 웹 서버 설정하는 방법

## 스프링 부트 내장 웹 서버 설정

스프링 부트 프로젝트를 생성할 시 스프링부트에서는 내장 서블릿 컨테이너인 톰캣(tomcat)이 자동으로 설정됩니다.
  
스프링부트에서는 `ServletWebFactoryAutoConfiguration` 클래스에서 자동적으로 `Tomcat`, `Jetty` 같은 내장 웹서버에 대한 설정을 자동적으로 처리하며 스프링부트 사용자가 쉽게 웹 서버 관련 설정을 하지 않아도 웹 서버 프로젝트를 안에 포함되게 합니다.

```java
@Configuration
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
@ConditionalOnClass(ServletRequest.class)
@ConditionalOnWebApplication(type = Type.SERVLET)
@EnableConfigurationProperties(ServerProperties.class)
@Import({ ServletWebServerFactoryAutoConfiguration.BeanPostProcessorsRegistrar.class,
      ServletWebServerFactoryConfiguration.EmbeddedTomcat.class,
      ServletWebServerFactoryConfiguration.EmbeddedJetty.class,
      ServletWebServerFactoryConfiguration.EmbeddedUndertow.class })
public class ServletWebServerFactoryAutoConfiguration {

   @Bean
   public ServletWebServerFactoryCustomizer servletWebServerFactoryCustomizer(
         ServerProperties serverProperties) {
      return new ServletWebServerFactoryCustomizer(serverProperties);
   }

   @Bean
   @ConditionalOnClass(name = "org.apache.catalina.startup.Tomcat")
   public TomcatServletWebServerFactoryCustomizer tomcatServletWebServerFactoryCustomizer(
         ServerProperties serverProperties) {
      return new TomcatServletWebServerFactoryCustomizer(serverProperties);
   }
```

위 `ServletWebServerFactoryAutoConfiguration`클래스 코드를 보면 `TomcatServletWebServerFactoryCustomizer` 클래스를 통해 자동적으로 톰캣을 커스터마이징한다는 것을 알 수 있습니다.
  
또한 기존 스프링 프로젝트에서 web.xml에서 설정해야 했던 `DispatcherServlet` 관련 설정 또한 아래 `DispatcherServletAutoConfiguration` 클래스를 통해 처리하고 있습니다.

```java
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
@Configuration
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnClass(DispatcherServlet.class)
@AutoConfigureAfter(ServletWebServerFactoryAutoConfiguration.class)
public class DispatcherServletAutoConfiguration {
```