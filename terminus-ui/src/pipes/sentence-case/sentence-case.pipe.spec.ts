import { TsSentenceCasePipe } from './sentence-case.pipe';


describe(`TsSentenceCasePipe`, () => {
  let pipeClass: TsSentenceCasePipe;
  let pipe: Function;

  beforeEach(() => {
    pipeClass = new TsSentenceCasePipe();
    pipe = pipeClass.transform;
  });


  test(`should return null if no value is passed in`, () => {
    expect(pipe(null)).toEqual(null);
    expect(pipe('')).toEqual(null);
  });


  test(`should format a date`, () => {
    const strings: string[] = [
      'HELLO THERE',
      'hi there friend',
      'i Am A hAcKeR',
    ];

    expect(pipe(strings[0])).toEqual('Hello there');
    expect(pipe(strings[1])).toEqual('Hi there friend');
    expect(pipe(strings[2])).toEqual('I am a hacker');
  });

});
