<!--
 * @Author: shufei.han
 * @Date: 2024-10-15 10:44:39
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-15 11:49:24
 * @FilePath: \kvm-web-vue3\src\views\LoginPage.vue
 * @Description: 
-->
<template>
    <div class="login-container flex full-height">
        <div class="login-content">
            <a-form :model="formState" :rules="formRules" name="basic" :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
                <a-form-item label="Username" name="user"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input v-model:value="formState.user" />
                </a-form-item>

                <a-form-item label="Password" name="passwd"
                    :rules="[{ required: true, message: 'Please input your password!' }]">
                    <a-input-password v-model:value="formState.passwd" />
                </a-form-item>

                <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                    <a-button :loading="state.loading" class="full-width" type="primary"
                        html-type="submit">Login</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { userService } from '@/api/user';
import type { FormRules } from '@/models/base.model';
import type { LoginParams } from '@/models/user.model';
import { message } from 'ant-design-vue';
import type { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const state = reactive({
    loading: false,
});

const formState = reactive<LoginParams>({
    user: '',
    passwd: '',
});

const formRules: FormRules<LoginParams> = {
    user: [
        { required: true, message: 'Please input your username!' },
    ],
    passwd: [
        { required: true, message: 'Please input your password!' },
    ],
}
const onFinish = async (values: LoginParams) => {
    state.loading = true;
    try {
        await userService.login(values);
        state.loading = false;
        message.success("Login success!")
        router.push('/');
    } catch (error) {
        console.log(error);
        
        message.error("Login failed! please check your username and password!")
        state.loading = false;
    }
};

const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    console.log('Failed:', errorInfo);
};
</script>

<style lang="scss" scoped>
.login-container {
    .login-content {
        padding: 16px;
        border: 1px solid var(--primary);
        border-radius: 8px;
    }
}
</style>