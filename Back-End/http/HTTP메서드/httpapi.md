# HTTP API를 만들어보자

요구사항 : 회원 정보 관리 api 를 만들어라.  
  
가장 중요한 것은 `리소스 식별`

### 리소스의 의미
- 회원을 등록하고 수정하고 조회하는게 리소스가 아니다.
  - 예 ) 미네랄을 캐라 -> 미네랄이 리소스
  - 회원이라는 개념 자체가 바로 리소스다
- 리소스를 어떻게 식별하는게 좋을까 ?
  - 회원을 등록하고 수정하고 조회하는 것을 모두 배제
  - 회원이라는 리소스만 식별하면 된다 -> 회원 리소스를 URI에 매핑


### API URI 설계
URI(Uniform Resource Identifier)  
리소스 식별 , URI 계층 구조 활용

- `회원` 목록 조회 / members
- `회원` 조회 /members/{id} -> 어떻게 구분?
- `회원` 등록 /members/{id} -> 어떻게 구분?
- `회원` 수정 /members/{id} -> 어떻게 구분?
- `회원` 삭제 /members/{id} -> 어떻게 구분?
- 참고 : 계층 구조상 상위를 컬렉션으로 보고 복수단어 사용을 권장(member >> members)

### 리소스와 행위를 분리
가장 중요한 것은 리소스를 식별하는 것
- URI 는 리소스만 식별!
- 리소스와 해당 리소스를 대상으로 하는 `행위`를 분리
  - 리소스는 명사, 행위는 동사
  - 행위(메서드)는 어떻게 구분할까?




### PUT
- 리소스를 대체
  - 리소스가 없으면 대체
  - 리소스가 없으면 생성
  - 쉽게 이야기해서 덮어버림
- 중요! 클라이언트가 리소스를 식별
  - 클라이언트가 리소스 위치를 알고 URI 지정
  - POST와 차이점

```
PUT /members/100 HTTP/1.1
Content-Type: application/json

{
	"username": "hello",
	"age": 20
}
```
리소스가 있는 경우1
```
PUT /members/100 HTTP/1.1
Content-Type: application/json

{
	"username": "old",
	"age": 50
}
```
->  
/members/100
```
{
	"username": "hello",
	"age": 20
}
```
=
```
{
	"username": "old",
	"age": 50
}
```

리소스가 없는 경우2
```
PUT /members/100 HTTP/1.1
Content-Type: application/json

{
	"username": "old",
	"age": 50
}
```
->  
/members/100  
이런 리소스 없음  
  
=
```
{
	"username": "old",
	"age": 50
}
```
주의 - 리소스를 완전히 대체한다1
```
PUT /members/100 HTTP/1.1
Content-Type: application/json

{
    "age": 50
}
```
->  
/members/100
```
{
	"username": "hello",
    "age": 20
}
```
=
```
{
    "age": 50
}
```

기존 리소스를 삭제하고 대체해서 username 필드가 삭제됨

<br>

### PATCH
- 리소스 부분 변경

```
PATCH /members/100 HTTP/1.1
Content-Type: application/json

{
    "age": 50
}
```
->  
/members/100
```
{
	"username": "young",
	"age": 20
}
```
=
```
{
	"username": "young",
	"age": 50
}
```
age만 50으로 변경

<br>

### DELETE
- 리소스 제거

```
DELETE /members/100 HTTP/1.1
Host: localhost:8080
```

#### HTTP 메서드의 속성
- 안전(Safe Methods)
- 멱등(Idempotent Methods)
- 캐시 가능(Cacheable Methods)

**안전 Safe**  
- 호출해도 리소스를 변경하지 않는다.
- q: 그래도 계속 호출하여 로그 같은게 쌓여 장애가 발생하면?
- a : 안전은 해당 리소스만 고려한다. 그런 부분까지 고려하지 않는다.

**멱등 Idempotent**  
- f(f(x)) = f(x)
- 한 번 호출하든 두 번 호출하든 100번 호출하든 결과가 똑같다.
- 멱등 메서드
- GET : 한 번 조회하든 몇 번을 조회하든 같은 결과가 조회된다.
- PUT: 결과를 대체한다. 따라서 같은 요청을 여러번 해도 최종 결과는 같다.
- DELETE : 결과를 삭제한다. 같은 요청을 여러번 해도 삭제된 결과는 똑같다.
- POST : 멱등이 아니다. 두 번 호출하면 같은 결제가 중복해서 발생할 수 있다.

- 활용
  - 자동 복구 매커니즘
  - 서버가 TIMEOUT 등으로 정상 응답을 못주었을 때, 클라이언트가 같은 요청을 다시 해도 되는가? 판단 근거
- q : 재요청 중간에 다른 곳에서 리소스를 변경해버리면?
  - 사용자1 : GET > username : A age : 20
  - 사용자2 : PUT > username : A age : 30
  - 사용자1 : GET > username :A age : 30 -> 사용자2의 영향으로 바뀐 데이터 조회
- A: 멱등은 외부 요인으로 중간에 리소스가 변경되는 것 까지는 고려하지 않는다.

**캐시 가능 Cacheable**
- 응답 결과 리소스를 캐시해서 사용해도 되는가?
- GET , HEAD , POST, PATCH 캐시 가능
- 실제로는 GET , HEAD 정도만 캐시로 사용
- POST, PATCH는 본문 내용까지 캐시 키로 고려해야 하는데, 구현이 쉽지 않음