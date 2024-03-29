# 데이터 모델링과 데이터 성질에 따른 DB 종류

## 데이터 모델링
주어진 개념으로부터 논리적인 데이터 모델을 구성하는 작업이다.

### 데이터 모델링의 목적
- 업무 정보를 구성하는 기초가 되는 정보들을 일정한 표기법에 의해 표현함으로써 정보 시스템 구축의 대상이 되는 업무 내용을 정확하게 분석하는 것
- 분석된 모델을 가지고 실제 데이터베이스를 생성해 개발 및 데이터 관리에 사용하기 위함

데이터 모델링은 중복성, 유연성, 일관성을 고려해 수행되어야 한다.  

- **중복성** : 같은 데이터베이스 내의 데이터 혹은 속성의 중복으로 저장되는 것을 지양해야 한다.

- **유연성** 빈번한 모델에 대한 수정/변경이 이루어지지 않도록 쿼리의 튜닝까지 고려해야한다. 

- **일관성** : 데이터 간의 연관된 정보를 무시하고 데이터가 갱신되는 경우를 피하고자 데이터 간 관계를 명확히 정의해야한다.


### 관계형 데이터베이스의 데이터 모델링 순서
1. 요구사항 파악
2. 개념적 데이터 모델 설계
3. 논리적 데이터 모델 설계
4. 물리적 데이터 모델 설계

