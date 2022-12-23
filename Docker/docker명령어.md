# 도커 기본 명령어

### 컨테이너 제어 명령어

#### 컨테이너 내려받기
예시로 nginx 컨테이너를 받는다면 다음과 같이 적을 수 있다. latest 태그는 가장 최신 버전의 컨테이너 이미지를 가져온다.

```
# docker pull NAME[:TAG]
$ docker pull nginx:latest
```

#### 컨테이너 실행
컨테이너 실행은 일반적으로 docker run 명령어를 사용하며 다음과 같은 형식을 가진다. `ubuntu:16.04` 컨테이너를 실행한다면 다음과 같이 실행할 수 있다.

```
# docker run [OPTION] IMAGE[:TAG] [COMMAND]
$ docker run -i -t ubuntu:16.04 /bin/bash
```

#### 포어그라운드 실행
t 옵션은 tty를 할당하고 i 옵션은 표준 입출력을 사용한다. 에시로 ubuntu 16.04 버전의 컨테이너를 -i , -t 옵션을 주어 생성하고 해당 컨테이너의 기본 커맨드임 /bin/bash를 실행한다. 해당 커맨드는 입력해주지 않아도 같은 동작을 예상한다.

```
$ docker run -i -t ubuntu:16.04 bin/bash
```

#### 데몬으로(detached) 실행
-d 옵션을 통해 데몬으로 실행한다. 일반적으로 웹서버 컨테이너 등을 해당 모드들로 실행한다. 예시로 nginx 컨테이너를 실행한다.

```
$ docker run -d -p 80:80 nginx
```