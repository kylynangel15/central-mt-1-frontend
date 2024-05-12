import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  allowComposition: true,
  messages: {
    en: {
      hello: 'hello!'
    },
    ja: {
      hello: 'こんにちは！'
    }
  }
})

export default i18n;