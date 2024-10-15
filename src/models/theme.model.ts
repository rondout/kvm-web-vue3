/*
 * @Author: shufei.han
 * @Date: 2024-08-01 09:58:13
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-08-01 10:05:48
 * @FilePath: /qiankun/main-app-vue/src/assets/models/theme.model.ts
 * @Description: 
 */
export interface ThemeColorConfig {
    main: string,
    light: string,
    dark: string,
    contrastText: string
}

export interface ThemeColors {
    primary: ThemeColorConfig
}

export const THEME_COLOR_KEY = 'theme-color'

export const defaultTheme: ThemeColors = {
    primary: {
        main: '#3f51b5',
        light: '#6573c3',
        dark: '#002984',
        contrastText: '#fff'
    }
}