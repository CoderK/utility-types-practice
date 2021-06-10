/*
이 유틸 타입은 A extends B가 naked type parameter이기에 분산 조건부 타입(Distributive conditional types)으로 동작함.
Generic에 할당한 Union Type의 개별 성분 각각을 판정한 후에 최종 결과를 Union Type으로 반환하는 원리.
결국 A와 B의 교집합을 갖는 타입을 얻는다.

아래의 예를 참고.

SetIntersection<'1' | '2' | '3', '2' | '3' | '4'>

'1' extends '2' ? never
'1' extends '3' ? never
'1' extends '4' ? never
'2' extends '2' ? '2'
'2' extends '3' ? never
'2' extends '4' ? never
'3' extends '2' ? never
'3' extends '3' ? '3'
'4' extends '3' ? never

최종 결과는 '2' | '3'
 */
export type SetIntersection<A, B> = A extends B ? A : never;
