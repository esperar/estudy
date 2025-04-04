# 네트워크 회선, VPN, DWDM

네트워크는 규모와 관리 범위에 따라 LAN, MAN, WAN으로 구성된다.
- LAN(Local Area Network): 사용자 내부 네트워크
- MAN(Metro Area Network): 한 도시 정도를 연결하는 네트워크
- WAN(Wide Area Network): 멀리 떨어진 LAN들을 연결하는 네트워크

예전에는 LAN, MAN, WAN에서 사용하는 기술이 모두 달라 프로토콜이나 전송 기술에 따라 구분은 쉬었는데 현재는 대부분의 기술이 이더넷에 통합되면서 사용자가 전송 기술을 구분하는게 무의미해졌다.

그래서 요즘엔 관리 범위를 기준으로 LAN MAN WAN을 구분한다고 한다 ㅇㅇ

<br>

## Network 회선

인터넷 회선, 전용 회선, 인터넷 전용 회선, VPN, DWDM 에 대해서 알아보자.

### 인터넷 회선

인터넷 접속을 위한 통신 사업자와 연결하는 회선을 인터넷 회선이라고 하는데 **통신 사업자와 케이블만 연결되었다고 인터넷 가능한게 아니라 통신 사업자가 판매하는 인터넷과 연결된 회선을 사용해야만 인터넷 접속이 가능하다.** 일반 인터넷 회선의 종류는 아래와 같다.
- 광랜(Ethernet): 기가 ~ 100Mbps
- FTTH: 기가 ~ 100Mbps
- 동축 케이블 인터넷: 수백~수십 Mbps
- xDSL(ADSL, VDSL등): 수십~수 Mbps

### 전용 회선

가입자와 통신 사업자간 대역폭을 보장해주는 서비스를 대부분 전용 회선이라고 한다.

가입자와 통신사업자 간에는 전용 케이블로 ㅇ녀결되어 있고 통신 사업자 내부에서 TDM(TIme Division Multiplexing) 같은 기술로 마치 직접 연결한 것 같은 통신 품질을 보장한다.

### 인터넷 전용 회선

인터넷 연결 회선에 대한 통신 대역폭을 보장해주는 상품을 인터넷 전용 회선이라고 한다.

가입자가 통신사업자와 연결되고, 이 연결이 다시 인터넷과 연결되는 구조다.

> 인터넷 연결을 위한 회선이 통신사업자와 가입자간에 전용으로 연결되어 있다.

가입자가 일반 가정에서 사용하는 접속 기술과 달리 다른 가입자와 경쟁하지 않고 통신사업자와 가입자간의 연결 품질을 보장한다.

### VPN

Virtual Private Network의 약자로 물리적으로는 전용선이 아니지만 가상으로 직접 연결한 것 같은 효과가 나도록 만들어주는 네트워크 기술이다.

**통신사업자 vpn**  
전용선은 연결거리가 늘어날 수록 비용이 증가하는데, 전용선은 사용 가능한 대역을 보장해주지만 가입자가 계약된 대역폭을 100퍼센트 사용하는것은 아니라 낭비되는 비용이 큰데 이런 낭비를 줄이고 비용을 줄이기 위해 통신사업자가 직접 가입자를 구분할 수 있는 VPN 기술을 통해 비용을 낮추고 있다, 대표적인 기술이 MPLS VPN 이다.

> MPLS VPN은 여러 가입자가 하나의 MPLS 망에 접속되지만 가입자를 구분할 수 잇는 기술을 적용해 전용선처럼 활용할 수 있다.  
> 이 기술을 통해 여러 가입자가 하나의 망에서 접속해 통신하므로 공용 회선고 함께 이용하게 되어 비용이 낮아진다.

**가입자 VPN**  
일반 사용자가 VPN을 사용한다면 대부분 가입자 vpn인데 일반 인터넷망을 이용해 사용자가 직접 가상 전용 네트워크를 구성할 수 있다.

인터넷 회선을 전용망처럼 구성해 사용할 수 있는 것이다.


### DWDM

Dense Wavelength Division Multiplex 파장 분할 다중화 전송 기술이라고 불리는 DWDM은 먼 거리를 통신할 때 케이블 포설비용이 너무 많이 들고 관리가 어려운 문제를 극복하기 위해 만들어졌다.

통신 사업자는 많은 가입자를 구분하고 높은 대역폭의 통신을 제공해야 하므로 어러 케이블을 포설해야하고 이런 물리적인 케이블을 포설하는데 어려움이 있었다.

WDM, DWDM 기술은 **하나의 광케이블에 다른 파장의 빛을 통해 여러 채널을 만드는 동시에 많은 데이터를 전송할 수 있는 기술이다.**

즉 하나의 케이블에서 다른 파장의 빛으로 여러 채널의 통신을 싫어 전달할 수 있는 것이다.

DWDM 전송 기술은 기존 WDM보다 더 많은 채널을 이용하는 기술로 최근에는 일반 가정에서 사용하는 기가 인터넷에서도 사용된다.

