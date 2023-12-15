type StreetSuffixTester<TAddress extends string, TSuf extends string> = TAddress extends `${infer _}${TSuf}` ? true : false;
