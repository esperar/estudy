# OS에서의 스와핑 Swapping

## Swapping
프로세스가 실행되기 위해서는 프로세스의 명령어와 명령어가 접근하는 데이터가 메모리에 있어야 한다. 그러나 프로세스 또는 프로세스의 일부분은 실행 중에 임시로 백업 저장장치로 내보내졌다가 실행을 계속하기 위해 다시 메모리로 되돌아올 수 있다.  
  

![](https://media.geeksforgeeks.org/wp-content/uploads/20200406111356/Untitled-Diagram66-3.jpg) 

Swapping을 통해서 물리 메모리의 제약을 덜 받을 수 있고 다중 프로그래밍 정도를 높일 수 있다. (degree of multiprogramming)  
  
- 메모리에서 나오는 것은 Swap out
- 메모리로 들어가는 것은 Swap in
  메모리 기준 in and out이다.


<br>

## 기본적인 스와핑
메인 메모리와 백업 저장장치 간에 전체 프로세스를 이동시킨다. (부분 스왑이 되는 경우도 있다.)  
백업 저장장치는 저장 및 다시 접근해야하는 프로세스의 크기에 상관없이 수용할 수 있게 엄청 커야한다.  
그리고 이러한 메모리 이미지에 직접 접근할 수 있어야 한다.  
  
프로세스 또는 일부가 백업 저장장치로 스왑될 때 프로세스와 관련된 자료구조는 백업 저장장치에 기록되어야 한다.  
  
표준 스와핑의 장점
- 실제 물리 메모리보다 더 많은 프로세스를 수용할 수 있도록 물리 메모리가 초과 할당될 수 있다는 것이다. 
- 유휴 또는 대부분의 시간을 유휴 상태로 보내는 프로세스가 스와핑에 적합한 후보이다.


## 페이징에서 스와핑
사실 표준 스와핑은 현재 잘 사용하지 않는 경우가 태반이며  
메모리와 저장장치 간에 프로세스 전체를 이동시키는 것이 힘들기 때문이다.
  
그래서 적은 수의 페이지만으로 이용하고는 한다.

![](https://t1.daumcdn.net/cfile/tistory/232C453455A737A119)

## 모바일 시스템에서 스와핑
모바일에서는 일반적으로 지원하지 않는다.