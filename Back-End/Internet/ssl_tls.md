# SSL(Security Socket Layer), TLS(Transfer Layer Security)

## SSL 

Security Socket Layer

인터넷을 통해 전달되는 정보 보안의 안전한 거래를 사용하기 위해 Netscape사에서 개발한 인터넷 통신 규약
  
90년대 중반 폐기된 프로토콜

SSL 계층은 응용 프로그램 계층과 전송 계층 사이에 위치

1. 응용 프로그램 계층 데이터가 SSL 계층에 전달
2. SSL 계층은 응용 프로그램 계층에서 수신한 데이터에 대한 암호화를 수행
3. 암호화된 데이터에 SSL 헤더(SH)라는 자체 암호화 정보 헤더를 추가
4. SSL 계층 데이터는 전송 계층(TCP/UDP)에 대한 입력이 된다.

## TLS
![](https://velog.velcdn.com/images/sweet_sumin/post/2f0b2f3a-df2d-4098-9313-88f1c999c337/image.png)

Transfer Layer Security

SSL 3.0을 기초로해서 IETF가 만든 프로토콜이다.

보안 및 개인 정보 보호 기능이 강화된 후속 인터넷 표준이다.

TLS는 단일 프로토콜이 아니고 2계층에 걸친 프로토콜이다.

현재 브라우저의 버전을 확인해보니 TLS 1.3 임을 확인했다.

![](https://velog.velcdn.com/images/sweet_sumin/post/14ea84f8-4ed0-4256-a450-42c5b1bf47a9/image.png)