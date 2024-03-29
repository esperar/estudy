# 서브넷팅 & 슈퍼넷팅 개념 및 쉬운 계산 방법

## 서브넷팅 Subnetting 

주어진 네트워크 주소를 작게 나누어 여러 개의 서브넷으로 구성

네트워크 식별자 부분을 구별하기 위한 Mask를 서브넷 마스크라고 부른다.

IP는 192.168.10.0 Subnetmask는 255.255.255.0으로 표시  
-> 네트워크 수: 1 / 호스트 수: 255개 사용 가능한 호스트 192.168.10.1 ~ 192.168.10.254

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FHoG6X%2Fbtq0n9bA9no%2F9BKdpjovjSNVs96eWMOsck%2Fimg.jpg)

지금부터 255개의 호스트가 하나의 네트워크로 묶인 것을 서브넷팅을 통해서 여러 개의 네트워크로 나누는 서브넷팅을 할 것입니다.

뒤에 2진수로 변환 후 8개의 0에 2개를 1로 변경 그러면 subnetmask는 255.255.255.192  
-> 네트워크 수: 4 / 호스트의 수: 64개

```
192.168.10.1 ~ 192.168.10.62 ( 각각의 네트워크로 나누어진 호스트들)

192.168.10.65 ~ 192.168.10.126

192.168.10.129 ~ 192.168.10.190

192.168.10.193 ~ 192.168.10.254
```

호스트 수 255개 하나의 네트워크를 서브넷팅을 통해 호스트수 64개씩 4개의 네트워크로 분리 서브넷팅을 통해 큰 네트워크를 여러 개의 작은 네트워크(Broadcast Domain)로 분리할 수 있는 것입니다

### 서브넷팅 사용 이유
1. 네트워크의 수와 호스트의 수를 여러 개로 나누어 효과적으로 네트워크를 설계하기 위함
2. 쓸데없이 큰 브로드케스트 도메인을 줄임으로써 효과적인 네트워크 구성
3. IPv4의 할당주소는 한정이 되어 있기 때문에 효율적으로 IP를 사용하기 위해

<br>

## 슈퍼넷팅 supernetting

서브넷팅의 반대말로 나누어진 네트워크를 합치는 작업

IP는 192.168.10.0 Subnetmask는 255.255.255.0으로 표시

-> 네트워크 수: 1 / 호스트 수: 255개  
사용 가능한 호스트 192.168.10.1 ~ 192.168.10.254

250명으로 사용하던 회사가 인원이 추가되면서 350명으로 늘었다고 보고 이때 슈퍼넷팅을 통해서 350명이 사용할 수 잇는 하나의 네트워크로 만드는 작업

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FCuk9B%2Fbtq0jM9z89P%2FrDLqNYvKGeLamMdB76puU0%2Fimg.jpg)

슈퍼넷팅 후 IP는 192.168.10.0 subnetmask는 255.255.254.0으로 표시  
-> 네트워크 수: 1 / 호스트 수: 512개  
  
사용 가능한 호스트 192.168.10.1 ~ 192.168.11.254

C Class 두 개를 슈퍼넷팅 후 합쳐서 하나의 네트워크로 구성하여 사용할 수 있습니다.