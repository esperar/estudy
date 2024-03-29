# Native Image

## AoT Compiler (Ahead of Time Compiler)

AoT 컴파일러는 기존 JIT 컴파일러와 다르게 C언어와 유사하게 자바 프로그램의 실행파일을 만들고, 해당 실행파일을 실행만 시키면 애플리케이션을 구동할 수 있다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FIZgx6%2FbtsmFgn4ntc%2FQVQkQ74ZyUXH9bYNgjlojk%2Fimg.png)

- JIT: 컴파일러를 이용해 런타임 중에 컴파일 및 최적화
- AoT: 컴파일러로 미리 컴파일된 네이티브 실행 파일을 실행

AoT는 Ahead of Time Compiler의 약자로 특정 디바이스에 맞는 기계어로 컴파일을 해두는 것이다.

최적화 역시 컴파일 하는 과정에서 함께 진행하게된다. 컴파일 후 즉시 실행 가능한 네이티브 실행파일이 만들어진다.

AoT 컴파일러는 JIT과 다르게 실행 파일이 구동되면 최적화를 진행하지 않는다.

JIT은 애플리케이션 실행시점에 바이트코드를 기계어로 번역하고 그 과정에서 프로파일링을 통해 얻어낸 실행 환경 정보를 바탕으로 최적화를 진행한다. 예를 들어 Intel CPU라면 Intel CPU에 맞게 바이트코드가 기계어로 번역되면서 최적화 해낸다. 이러한 이유로 JIT 컴파일러를 **동적 컴파일러**라고도 부른다.

반대로 AoT 컴파일러는 이미 특정 환경에 맞게 기계어로 컴파일을 진행하므로 실행 환경 정보 수집이 어렵다. 또한 컴파일 과정에서 무겁고 복잡한 분석 및 최적화를 수행한다. 이러한 이유로 AoT 컴파일러를 **정적 컴파일러**라고 한다.

<br>

## Native Image

네이티브 이미지는 자바 코드를 바이너리로 즉 ahead of time(미리) 컴파일 하는 기술이고

네이트브 실행 파일에는 런타임에 필요한 코드(애플리케이션 클래스, 라이브러리 클래스, 언어 런타임, JDK 정적 링크된 네이티브코드)만 포함된다.

GraalVM에서는 AoT 컴파일러를 새롭게 추가하였고 Native Image를 지원하기 시작했다.

즉 JVM없이 자바 코드를 실행할 수 있는 시대가 온 것이다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fdq2auF%2FbtsmJCWUN8b%2FwW27eTZWa5OBxyjjiHkQh1%2Fimg.png)


네이티브 이미지로 생성된 실행 파일에는 다음과 같은 장점들이 있다
- JVM에 필요한 리소스 일부를 사용하므로 실행 비용이 저렴함
- 밀리초 내에 시작된다.
- 워밍없 없이 즉각적으로 최고의 성능을 제공한다.
- 빠르고 효율적인 배포를 위해 경량 컨테이너 이미지로 패키징이 가능하다.
- 기타로 더더더더 있음 !

네이티브 실행 파일은 네이티브 이미지의 빌더 또는 네이티브 이미지 도구에 의해 생성된다.

애플리케이션 클래스 및 기타 메타데이터를 처리하여 특정 운영 체제 및 아키텍처를 위한 바이너리를 생성해낸다.

네이티브 이미지 도구는 아래와 같은 순서대로 작업을 처리하고, 이 프로세스는 자바 코드를 바이트코드로 컴파일하는 것과 명확하게 구분하기 위해 빌드 타임이라고 한다.

1. 정적 분석을 수행 애플리케이션이 실행될 때 도달할 수 있는 클래스와 메서드를 결정함
2. 클래스와 메서드 및 리소스를 바이너리로 컴파일한다.

GraalVM을 사용하면 자바 바이트코드를 platform-specific, self-contained한 네이티브 실행 파일로 컴파일하여 애플리케이션을 더 빠르게 시작하며 설치 공간을 줄일 수 있다.

> 네이티브 이미지 기능은 기본적으로 제공되는 것이 아니라서 GraalVM 업데이터를 통해 쉽게 설치할 수 있다. 참고로 GraalVM은 리눅스와 맥 만을 집중적으로 지원중이다.


네이티브 이미지 설치 명령어
```bash
gu install native-image
```

### 성능과 한계

위의 글들을보면 정말 네이티브 이미지가 성능적으로 뛰어나고 좋아보이지만 실제로 테스트해보면 예상치 못한 상황이 나오기도한다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FxWpUv%2FbtsmJhk7QVl%2FWKeddPPUL7ZRf3XZdN66TK%2Fimg.png)

위의 그래프를 보면 초기에는 AoT 컴파일러가 훨씬 뛰어난 성능을 보여준다.

그 이유는 AoT 컴파일러는 특정 환경에 맞게 기계어로 번역하고 최적화까지 된 상태이기 때문이다.

그러나 시간이 지나고나면 JIT 컴파일러가 더 높은 성능을 보여준다.

그 이유는 JIT 컴파일러는 실행된 후 실행 환경 정보를 바탕으로 최적화를 진행하기 때문이다.

즉 여기서 우리가 알 수 있는 것은 AoT가 항상 JIT보다 빠른것도 아니다. **네이티브 이미지는 JIT이 느려서 나온게 아니다.**

네이티브 이미지는 무조건 빠른 것이 아닌 **처음 실행 스타트가 매우 빠른 것이다.** 초기에 빠른 실행과 처리에 포커스를 맞추어 개발된 것이다. 그래서 전반적으로는 아직 최적화 기술이 필요하다.

심지어 특정 환경에 맞는 컴파일과 최적화를 진행해야하므로 네이티브 빌드도 오랜 시간이 소요되는데 이 점도 해결해야할 문제 중 하나다.

### 네이티브 이미지의 스타트가 빠른이유?
바로 **힙 이미지**때문이다. 

이게 뭐냐면 예를 들어서 static 블록이나 클래스 로딩 등을 이미지로 만들어둠으로써, 조금 더 빠른 실행이 가능해진 것이다.

하지만 이로 인한 문제도 있다. 바로 리플랙션, 클래스 로딩, 동적 프록시와 같은 동적 기술과 관련된 부분이다.

AoT 컴파일러가 정적으로 실행되다 보니, 동적 기술과 관련된 부분에서 문제가 많다.

스프링과 같은 프레임워크는 동적 기술을 극한으로 사용주잉라 이와 관련해 GraalVM과 협력으로 많은 문제를 해결하고 있다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FlPqcn%2FbtsmG9IcnLd%2FYjDeOBmyWIO9estbxq3Pzk%2Fimg.png)

위의 사진은 AoT와 JIT을 비교한 사진이다.

AoT는 빠른 실행, 적은 용량, 낮은 메모리에 대한 장점이 있다. 즉 서버리스 아키텍처에 적합할 것이다.
물론 더 많은 최적화 기술이 도입되면 얘기가 달라질 수 있겠지만, 아직까지는 서버리스에 가장 적합한 것으로 얘기되고 있다.

결국 둘 다 필요하며 상황에 따라 다르다고 볼 수 있다. 서버리스처럼 빠른 실행이 필요한 경우에는 AoT, 오랜 시간 애플리케이션을 유지하는 서버 환경에서는 JIT이 더 적합할 것이다.


### 그런데?
그런데 이러한 내용들은 Java 21을 지원하는 GraalVM 부터 다른 양상을 보이기 시작한다!

[GraalVM for JDK 21 포스팅](https://medium.com/graalvm/graalvm-for-jdk-21-is-here-ee01177dd12d)에 따르면 이제는 profile-guided된 최적화를 적용하면 **JIT보다 일관적으로 뛰어난 성능을 보이고 있다고 한다.**
 
론 해당 내용은 OracleVM의 네이티브 이미지를 바탕으로 하지만, **중요한 포인트는 이제 JRE JIT을 능가할 수 있다는 점이다.** 

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FHAEDG%2FbtsvmadqYUt%2FrUyeKHycwIAtPSoRQAymGk%2Fimg.png)


다음시간에는 네이티브 이미지의 메모리와 최적화 기법 gc들에 대해서 알아보도록 하겠다.