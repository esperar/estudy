# 웹 캐시 Web Cache

## 캐시
캐시는 컴퓨터 과학에서 데이터나 값을 미리 복사해 놓는 `임시 저장소`를 가르킨다.
  
웹에서도 동일한 요청의 경우 같은 데이터를 다시 다운로드하지 않고 이를 웹 캐시로 저장하여 빠르게 불러올 수 있다.
  
개인의 컴퓨터에 저장하는 프라이빗 캐시뿐만 아니라 여러 유저에게 공통적으로 보여지는 데이터의 경우 프록시 서버에 별도로 캐시를 저장하여 사용자 경험을 향상시킬 수 있다.

## 캐시가 없을 때

![](https://velog.velcdn.com/images/mmmdo21/post/00004bb9-4d31-4613-bdc6-cfc754f14241/image.png)

같은 이미지를 다시 요청하더라도 첫 번째 처럼 똑같이 1.1M의 응답을 보낸다.  
이 경우에
- logo.jpg 데이터가 변경되지 않아도 계속 데이터를 새로 다운받아야 한다.
- 인터넷 네트워크는 매우 느리고 비싸다
- 브라우저 로딩 속도가 느려진다.
- 느림 사용자 경험을 제공한다.

-> 브라우저가 이를 저장하는 방법은 없을까?

## 캐시 적용
캐시에 데이터를 미리 복사해 놓으면 계산이나 접근 시간 없이 더 빠른 속도로 데이터에 접근할 수 있다.
  
브라우저에 캐시를 저장할 땐 헤더에 cache-control 속성을 통해 캐시가 유요한 시간을 지정할 수 있다.
  
캐시의 접근 시간에 비해 원래 데이터를 접근하는 시간이 오래 걸리는 경우나 값을 다시 계산하는 시간을 절약하고 싶은 경우에 사용한다.

### 첫 번째 요청

![](https://velog.velcdn.com/images/mmmdo21/post/5acf05ec-c92a-449f-afd7-edf9666d0cf4/image.png)

![](https://velog.velcdn.com/images/mmmdo21/post/62120fc4-a71b-4299-8c4b-4760db7ebfdd/image.png)

응답을 받았을 때 브라우저 캐시에 해당 응답 결과를 저장하며 이는 60초간 유요함

## 캐시 적용 - 캐시 시간이 초과햇을 경우

### 두 번째 요청
두 번째 요청에선 캐시를 우선 조회하게 된다.
- 캐시가 존재하고 아직 60초가 지나지 않아 유효한 캐시라면 해당 캐시에서 데이터를 가져온다.

![](https://velog.velcdn.com/images/mmmdo21/post/45f3b7b8-1e9e-4541-a786-1aeb405f36f1/image.png)

### 캐시를 쓰는 이유
1. 캐시 덕분에 캐시 기능 시간동안 네트워크를 사용하지 않아도 됨
2. 비싼 네트워크 사용량을 줄일 수 있음
3. 브라우저 로딩 속도가 매우 빠름
4. 빠른 사용자 경험을 제공


### 세 번째 요청
근데 만약 캐시의 유효시간이 초과한다면?

![](https://velog.velcdn.com/images/mmmdo21/post/5e10a2d3-5980-493b-9d68-070c79bb0617/image.png)

이 경우에 다시 서버에 요청을 하고 60초간 유효한 logo.jpg의 이미지를 응답받는다.
  
이때 다시 네트워크 다운로드가 발생하게 된다.

![](https://velog.velcdn.com/images/mmmdo21/post/166cc79d-b96e-490d-98a8-e42e3dc2fc6a/image.png)

즉, 캐시 유효 시간이 초과하면, 서버를 통해 데이터를 다시 조회하고, 캐시를 갱신한다. 이때 다시 네트워크 다운로드가 발생한다.

![](https://velog.velcdn.com/images/mmmdo21/post/0d33531e-bfcc-448b-acd5-817c904c8e93/image.png)

응답 결과를 브라우저가 렌더링 하면 브라우저 캐시는 기존 캐시를 지우고 새 캐시로 데이터를 업데이트함
  
이 과정에서 캐시 유효 시간이 다시 초기화됨