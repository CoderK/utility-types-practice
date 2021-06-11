/*
이 유틸 타입은 A extends B가 naked type parameter를 받아서 분산 조건부 타입(Distributive conditional types)으로 동작함.
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

/*
A - B
SetIntersection과 정확히 반대로 동작함.


'1' extends '2' ? '1'
'1' extends '3' ? '1'
'1' extends '4' ? '1'

'2' extends '2' ? 'never'
'2' extends '3' ? '2'
'2' extends '4' ? '2'

'3' extends '2' ? '3'
'3' extends '3' ? 'never'

'4' extends '3' ? 'never'

never 판정이 없는 '1'이 최종 반환 값.
*/
export type SetDifference<A, B> = A extends B ? never : A;

/*
여집합 구하기.

A1 extends A는 A1이 A의 부분집합만 가질 수 있게 제한하는 역할을 한다.
A1 extends A는 아래와 같이 판정하고,

2 extends 1 = false
2 extends 2 = true
2 extends 3 = false

3 extends 1 = false
3 extends 2 = false
3 extends 3 = true

이는 결국 SetDifference<'1' | '2' | '3', '2' | '3'>와 같고, 최종 결과는 "1".

*/
export type SetComplement<A, A1 extends A> = SetDifference<A, A1>;


/*
대칭차 구하기
- 둘 중 한 집합에는 속하지만 둘 모두에는 속하지 않는 집합.
- (A 합집합 B - A 교집합 B)

A = A | B
'1' | '2' | '3' | '4'

B = A & B
'2' | '3'

A - B = '1' | '4'
*/
export type SymmetricDifference<A, B> = SetDifference<A | B, A & B>;
