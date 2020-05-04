import gravatar from '../../utils/gravatar';

test('Gravatar function test', () => {
    const email = 'test@test.com';
    const gravatarUrl = 'https://gravatar.com/avatar/fd4b38e94292e00251b9f39c47ee5710';
    expect(gravatarUrl).toEqual(gravatar(email));
});