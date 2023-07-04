# AWS RDS (Relation Database Service)

## RDS란?
Amazon Relational Database Service(RDS)를 사용하면 클라우드에서 관계형 데이터베이스를 간편하게 설정, 운영 및 확장할 수 있다.
  
하드웨어 프로비저닝, 데이터베이스 설정, 패치 및 백업과 같은 시간 소모적인 관리 작업을 자동화하면서 비용 효율적이고 크기 조정 가능한 용량을 제공한다.
  
사용자가 애플리케이션에 집중하여 애플리케이션에 필요한 빠른 성능, 고가용성, 보안 및 호환성을 제공할 수 있도록 지원한다.

![](https://user-images.githubusercontent.com/28394879/141259851-a09fe71d-97fd-4716-92de-9154f23cf694.png)

## RDS의 특징

### 관계형 데이터베이스를 제공하는 서비스
Relational Database Service: 관계형 데이터베이스
  
<--> NoSQL(DynamoDB, DocumentDB, ElasticCache)

### 가상 머신 위에서 동작
단 직접 시스템에 직접 로그인 불가능 -> OS 패치, 관리 등은 AWS의 역할

### RDS는 Serverless 서비스가 아님
단 Aurora Serverless는 말그대로 Serverless 서비스

### CloudWatch와 연동
DB 인스턴스의 모니터링(EC2와 동일)  
  
DB에서 발생하는 여러 로그(Error Log, General Log등)을 CloudWatch와 연동하여 확인 가능

### 내부에서는 EC2를 활용
VPC안에서 동작
- 기본적으로 public IP를 부여하지 않아 외부에서 접근 불가능
- 설정에 따라 public으로 오픈 가능 (DNS로 접근)

서브넷과 보안 그룹 지정 필요
  
EC2 타입의 지정 필요
  
스토리지는 EBS를 활용
- EBS 타입의 선택 필요
- 생성시 EBS의 용량을 지정해서 생성

Parameter Group: Root 유저만 설정 가능한 DB의 설정값들을 모아 그룹화한 개념
- DB 클러스터에 파라미터 그룹을 적용시켜 설정값을 적용

업데이트
- 마이너 버전 엔진 업데이트는 자동으로 업데이트 설정 가능
- 기타 업데이트의 경우 점검 시간(Maintenance Window)를 설정하여 특정 시간에 업데이트가 이루어질 수 있도록 설정 가능

## RDS의 인증 방법

### 전통적인 유저/패스워드 방식

AWS Secret Manager와 연동하여 자동 로테이션 가능

### IAM DB 인증
데이터베이스를 IAM 유저 Credential/Role을 통해 관리 가능

### Keberos 인증

### RDS의 가격 모델

컴퓨팅 파워 + 스토리지 용량 + 백업 용량 + 네트워크 비용
  
Reserved Instance 구매 가능
- EC2와 마찬가지로 일정 기간을 게약하여 저렴한 가격에 서비스를 이용


