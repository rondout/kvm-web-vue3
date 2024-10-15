import type { Rule } from 'ant-design-vue/es/form';

export type FormRules<T extends Record<string, any> = Record<string, any>> = {
    [propName in keyof T]: Rule | Rule[];
  };