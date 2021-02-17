import * as bcrypt from 'bcrypt'

describe('generate password hash', () => {
  it('creats a hash for a password of your choice for .env', async () => {
    const password = 'enter your password here'
    const hash = await bcrypt.hash(password, 10)
    console.log('your hash:', hash)
    expect(hash).toBeDefined()
  })
})
