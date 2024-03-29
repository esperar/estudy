# 데이터베이스 옵티마이저 (Optimizer)

## 옵티마이저
옵티마이저란 **SQL을 가장 빠르고 효율적으로 수행할 최적의 처리경로를 생성해 주는 DBMS 내부의 핵심 엔진이다.**  
  
사용자가 구조화된 질의어(SQL)로 결과 집합을 요구하면, 이를 생성하는데 필요한 처리 경로는 DBMS에 내장된 옵티마이저가 자동으로 생성해준다.  
  
옵티마이저가 생성한 SQL 처리경로를 `실행계획(Execution Plan)`이라고 한다.
  
### 옵티마이저의 SQL 최적화 과정

1. 사용자가 던진 쿼리 수행을 위해, 후보군이 될만한 실행계획을 찾는다.
2. 데이터 딕셔너리에 미리 수집해 놓은 오브젝트 통계 및 시스템 통계정보를 이용해 각 실행계획의 예상 비용을 산정한다.
3. 각 실행계획을 비교하여 최저비용을 갖는 하나를 선택한다.

옵티마이저의 종류는 **규칙 기반 옵티마이저, 비용 기반 옵티마이저**가 있다.

## 규칙 기반 옵티마이저 RBO: Rule-Based Optimizer

규칙 기반 옵티마이저는 **실행 속도가 빠른 순으로 규칙을 세워두고 우선순위가 높은 방법**을 채택하는 옵티마이저이다. 
  
여기서 규칙이란 액세스 경로별 우선순위로서, 인덱스 구조, 연산, 조건절 형태가 순위를 결정짓는 주요인이다. 규칙의 우선순위는 다음과 같다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FkVfPK%2Fbtq7UYBCv7Z%2FO0tIbTzbc4mwyjPBnKAYqk%2Fimg.png)

1. ROWID를 사용한 단일 행인 경우
2. 클러스터 조인에 의한 단일 행인 경우
3. 유일하게 기본키를 가진 해시 클러스터 키에 의한 단일 행인 경우
4. 유일하게 기본키에 의한 단일 행인 경우
5. 클러스터 조인인 경우
6. 해시 클러스터 조인인 경우
7. 인덱스 클러스터 키인 경우
8. 복합 컬럼 인덱스인 경우
9. 단일 컬럼 인덱스인 경우
10. 인덱스가 구성된 컬럼에서 제한된 범위를 검색하는 경우
11. 인덱스가 구성된 컬럼에서 무제한 범위를 검색하는 경우
12. 정렬 병합 조인인 경우
13. 인덱스가 구성된 컬럼에서 MAX, MIN을 구하는 경우
14. 인덱스가 구성된 컬럼에서 ORDER BY를 실행하는 경우
15. 전체 테이블을 스캔하는 경우


## 비용 기반 옵티마이저 CBO : Cost-Based Optimizer
비용 기반 옵티마이저는 말 그대로 비용을 기반으로 최적화를 수행한다.  
  
여기서 `비용`이란 쿼리를 수행하는데 요소되는 일 량 또는 시간을 뜻한다.  
CBO는 실행 계획을 최대 2천개까지 세운 뒤 비용이 최소한으로 나온 실행 계획을 수행하게 된다.  
이때 실행계획을 수립할 때 판단되는 기준이 되는 비용은 **예상치**다.  
따라서 CBO는 비용을 예측하기 위해 테이블,인덱스,컬럼 등의 다양한 객체 통계정보 및 시스템 통계 정보 CPU 속도, 디스크 I/O속도 등을 이용한다.  
  
역사가 오래된 Oracle은 RBO로 시작했으나 다른 상용 RDBMS는 탄생 초기부터 CBO를 채택하였다. Oracle 또한 10g 버전부터는 RBO에 대한 지원을 중단하고 CBO를 채택하였다.

