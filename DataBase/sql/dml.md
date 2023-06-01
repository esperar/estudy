# DML(INSERT, UPDATE, DELETE, SELECT) 실습 + TCL(COMMIT, ROLLBACK)

> 이전 DDL 실습에서 만들었던 NETFLIX 테이블을 사용해 실습을 진행하겠다.

## INSERT

INSERT문으로 데이터를 삽입해보겠다.

```sql
INSERT INTO NETFLIX VALUES('나의 아저씨', '드라마', 30, SYSDATE); 

COMMIT;
```

SYSDATE는 프로그램 환경에서 현재 시간을 의미한다.  
COMMIT은 저장한 데이터를 영구적으로 반영한다 (영속화) 한다는 명령어이다.
  
계속해서 진행해보겠다. 이번에는 특정 컬럼에만 데이터를 추가해보겠다.  
그리고 또 오늘로부터 30일전, 40일전, 300일전에 등록된 영상 데이터들의 새로운 데이터들을 추가해보겠다
```sql
INSERT INTO NETFLIX (VIDEO_NAME, VIEW_COUNT) VALUES('시그널', 42)

INSERT INTO NETFLIX VALUES('응답하라 1988', '드라마', 42, SYSDATE - 30); 
INSERT INTO NETFLIX VALUES('이태원 클라쓰', '드라마', 32, SYSDATE - 40); 
INSERT INTO NETFLIX VALUES('미스터 션샤인', '드라마', 22, SYSDATE - 300); 

COMMIT;

ROLLBACK;
```

만약 저 데이터들을 인서트하고 ROLLBACK을 입력한다면 다시 데이터가 나의 아저씨만 남게 될것이다. (최근 커밋을 롤백함)

## UPDATE
위에 인서트문에서 시그널은 카테고리와 등록 날짜가 NULL로 되어있다.  
이번에는 컬럼의 값들을 수정해볼 것인데 일단 먼저 나의 아저씨 조회수를 수정해보겠다.

```sql
UPDATE NETFLIX SET VIEW_COUNT = 70 WHERE VIDEO_NAME = '나의 아저씨';

COMMIT;
```

이어서 시그널에 카테고리와 등록 날짜를 추가해보겠다.

```sql
UPDATE NETFLIX SET CATEGORY = "드라마", REGISTER_DATE = TO_DATE('20230101', 'YYYYMMDD') =  WHERE VIDEO_NAME = '시그널';

COMMIT;
```

TO_DATE() 함수는 날짜를 입력받고 (첫번째 인자) 지정한 포멧 형식(두번째 인자)으로 변환해 DATE형으로 만든다. 