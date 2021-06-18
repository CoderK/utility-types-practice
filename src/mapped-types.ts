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

/*
undefined이면 never, 아니면 반환.
never는 존재할 수 없는 상태를 표현하는 타입.
never 타입의 변수에는 어떤 값을 할당해도 컴파일 에러가 발생함.
naked type parameter를 받는 Conditional types에서 never는 거절의 의미를 가짐.

NonUndefined<string | null | undefined>;
*/
 export type NonUndefined<A> = A extends undefined ? never : A;

/*
 -?: Remove Optional(즉, 존재해야 함을 표현)
 [K in keyof T]-?: T의 모든 프로퍼티 키를 K에 할당하며 순회
 NonUndefined<T[K]>: T의 프로퍼티가 참조하는 값이 undefined인 Union Type
 NonUndefined<T[K]> extends Function ? K : never: T의 프로퍼티가 참조하는 값이 Function 타입이면 키를 반환, 아니면 제외

 결국,
 object인 T의 프로퍼티 중에서 프로퍼티 타입이 Function인 프로퍼티 키를 갖는 개체 타입을 정의하고, 
 이 개체 타입의 모든 키를 Union Type으로 변환

 {}[keyof T]의 역할은 https://stackoverflow.com/questions/64072249/typescript-type-declaration-with-square-brackets 참고
 만들어진 타입에서 T의 키에 해당하는 값만 유니온 타입으로 추출하는 역할.
*/
export type FunctionKeys<T extends object> = {
    [K in keyof T]-?: NonUndefined<T[K]> extends Function ? K : never;
}[keyof T];

export type NonFunctionKeys<T extends object> = {
    [K in keyof T]-?: NonUndefined<T[K]> extends Function ? never : K;
}[keyof T]

/*
아래 코드가 동작하는 방식 탐구.
(<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B

조건 타입(conditional type) 간의 호환성(compatibility or assignability)을 판단할 때 비교 효율을 높이고자 아래의 단축 경로를 적용하는 케이스가 있음.
> 조건 타입의 구성이 "A extends B ? C : D"와 같을 때 A, B, C, D가 모두 같으면 두 조건 타입은 같다.

따라서 T extends X ? 1 : 2와 T extends Y ? 1 : 2는 X와 Y만 같으면 동치라고 판단함.
(참고: https://github.com/microsoft/TypeScript/pull/21782?fbclid=IwAR0pxAn6DDLv8NYULWBSCmsJvNypDJ1X-gMjk0s34ooYsfMCgpdqLDPCWWA)

그런데 IfEquals 타입 인터페이스 설계상 T를 알 수 없는 게 문제.
지연 조건 타입(conditional types being deferred)을 끌어와서 이 문제를 해결함.
그게 바로 "(<T>() => T extends X ? 1 : 2)" 이 부분.
"<T>() => T" 함수 타입의 T를 알 수 없기 때문에 지연 조건 타입으로 분류되고,
지연 조건 타입이 있을 때 TypeScript는 조건 타입 호환성 비교에 아래의 규칙을 적용함.

- 두 조건 타입이 같은 제약 조건을 가지고 있는가?
- 두 조건 타입의 참, 거짓 부분이 둘 다 같은 타입으로 구성되어 있는가?

결국 A extends B ? C : D에서 A가 지연 조건 타입이면 B, C, D만 보고 동치를 판단함.
(참고: https://github.com/Microsoft/TypeScript/issues/27024?fbclid=IwAR3CIouvyMCA4TTq9wbRAx1P9EMihL4_13GHZoL9htJkP0Tmh184Qnp5hwY#issuecomment-510924206)

이 규칙을 따라서 X와 Y가 같은 타입이면 참, 아니면 거짓으로 판정하는 원리.
*/
export type IfEquals<X, Y, A = X, B = never> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? A : B;