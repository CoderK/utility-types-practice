/*
  bigint: Number 원시값이 표현할 수 있는 수의 범위인 2^53 - 1 보다 큰 정수를 표현할 수 있는 타입.
  JS는 number를 배정밀도 부동소수점(부호 1 + 지수부 11 + 가수부 52)으로 취급함.
 */
export type Primitive = string | number | bigint | boolean | symbol | null | undefined;

export type Falsy = false | '' | 0 | null | undefined;

export type Nullish = null | undefined;

/*
 "is"는 타입 서술로서 함수가 반환하는 타입을 명시하여 컴파일러가 타입을 더 정확하게 추론할 수 있게 돕는다.
 아래의 코드에서 isPrimitive가 반환하는 val의 타입이 Primitive임을 명시하는 역할을 함.
 */
export const isPrimitive = (val: unknown): val is Primitive => {
    if(val === null || val === undefined) {
        return true;
    }

    switch(typeof val) {
        case 'string':
        case 'number':
        case 'bigint':
        case 'boolean':
        case 'symbol': {
            return true;
        }
        default:
            return false;
    }
}

export const isFalsy = (val: unknown): val is Falsy => !val;
export const isNullish = (val: unknown): val is Nullish => val === null || val === undefined;