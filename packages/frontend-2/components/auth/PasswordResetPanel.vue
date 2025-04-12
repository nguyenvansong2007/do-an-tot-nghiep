<template>
  <form class="mx-auto w-full px-2" @submit="onSubmit">
    <h1 class="text-heading-xl text-center inline-block mb-4">Đặt lại mật khẩu</h1>
    <div class="flex flex-col space-y-4 text-body-xs">
      <div>
       Nhập địa chỉ email bạn đã sử dụng để chúng tôi có thể xác minh tài khoản của bạn. 
       Chúng tôi sẽ gửi cho bạn hướng dẫn về cách đặt lại mật khẩu.
      </div>
      <div>
        <FormTextInput
          name="resetEmail"
          color="foundation"
          size="lg"
          type="email"
          placeholder="email@example.com"
          :rules="emailRules"
        />
      </div>
    </div>

    <div class="flex flex-col gap-y-2 mt-4">
      <FormButton submit full-width size="lg" :disabled="loading">
        Gửi email đặt lại mật khẩu
      </FormButton>
      <FormButton color="outline" size="lg" full-width :to="homeRoute">
        Về trang chủ
      </FormButton>
    </div>
  </form>
</template>
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { homeRoute } from '~/lib/common/helpers/route'
import { usePasswordReset } from '~~/lib/auth/composables/passwordReset'
import { isEmail, isRequired } from '~~/lib/common/helpers/validation'

type FormValues = { resetEmail: string }

const { handleSubmit } = useForm<FormValues>()
const { sendResetEmail } = usePasswordReset()

const emailRules = [isEmail, isRequired]
const loading = ref(false)

const onSubmit = handleSubmit(
  async ({ resetEmail }) => await sendResetEmail(resetEmail)
)
</script>
