# 开发笔记

## 目标

创建完善的 Vector CAPL VSCode 扩展，实现语法高亮、悬停文档、代码补全、跳转定义、查找引用、参数检查、类型检查等功能。

## 关键决策

### 1. 函数数据格式

键名使用 `functionName(params)` 格式以区分重载：

```typescript
// 键名格式
'Write(caplString text)': 'Syntax: void Write(caplString text)\nDescription: ...'
'WriteEx(caplString text, dword logCfg, dword dbgLvl)': 'Syntax: void WriteEx(...)'
```

### 2. 类型检查

- 变量未定义 → 报错
- 类型不兼容 → 警告
- 兼容类型：dword/long、byte/char/boolean 可互换

### 3. 参数数量检查

```typescript
// 支持变参函数
function WriteEx(...): 实际参数 >= 3 才报错
```

## 待完成

1. 测试悬停和补全功能
2. 检查 CanTp 等复杂函数族
3. 完善类型检查逻辑

## 帮助文档路径

`C:\Program Files\Vector\Help\Vector CANoe Help 19.5.44\en`

## 函数统计

- 4803 个主题 (HELP_EXTRACTED.json)
- 7474 个函数/重载 (caplData.ts)
- 排除单字母名称和无效字符