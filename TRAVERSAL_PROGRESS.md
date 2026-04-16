# CAPL函数遍历进度报告

## 遍历日期
2026-04-16

## 已遍历的示例项目目录
C:\Users\Public\Documents\Vector\CANoe\Sample Configurations 19.5.44

## 已发现的函数分类 (按发现顺序)

### 1. 核心函数 (Basic Functions)
- on message, on timer, on key, on envvar, on start, on stop
- putValue, getValue, output, write, writeLineEx
- setTimer, cancelTimer, msTimer
- elcount, timeNow, timeNowMS
- $Message::Signal, @sysvar::Namespace

### 2. 数学函数 (Math)
- sqrt, abs, sin, cos, tan, asin, acos, atan, atan2
- log, log10, exp, pow, floor, ceil, round
- _max, _min, _round, _ceil, _floor, _pow, _sqrt, _abs, _sign

### 3. 字符串函数 (String)
- strlen, strcpy, strcat, strncpy, strncat
- strcmp, strncmp, strchr, strstr, strrchr
- sprintf, sscanf, atoi, atof, atol
- tolower, toupper, mbstrlen

### 4. 内存函数 (Memory)
- memset, memcpy, memcmp, memmove

### 5. 文件函数 (File)
- filemap, fileclose, fileread, filewrite

### 6. 诊断函数 (Diagnostic)
- diagRequest, diagSendRequest, diagGetLastResponse
- diagSetParameter, diagGetParameter
- diagIsPositiveResponse, diagSendPositiveResponse, diagSendNegativeResponse
- diagGetP2Timeout, diagGetP2Extended
- DiagGetParameter, DiagSetParameter, GetParameter, SetParameter

### 7. 输出函数 (Output)
- output, write, writeLineEx
- writeDbgLvlPrefix, setWriteDbgLevel
- elnl, elprintf, elprintfex

### 8. 测试函数 (Test)
- testcase, testfunction, testwait, testassert, teststep
- testWaitForSignalMatch, testWaitForSignalInRange
- testWaitForTextEvent, testSupplyTextEvent
- TestStepPass, TestStepFail, TestStatus
- TestCommandBegin, TestCommandEnd
- testReportAddEngineerInfo, testReportAddSUTInfo
- testReportWriteDiagObject, testReportAddWindowCapture

### 9. 系统变量函数 (System Variables)
- sysGetVariableLong, sysSetVariableLong
- sysGetVariableFloat, sysSetVariableFloat
- sysGetVariableString, sysSetVariableString
- sysGetVariableInt64, sysSetVariableInt64
- sysGetVariableData, sysSetVariableData
- sysBeginVariableStructUpdate, sysEndVariableStructUpdate
- @sysvarMember, @sysvarInt, @sysvarFloat, @sysvarString

### 10. J1939 IL函数
- J1939ILSetSignal, J1939ILSetSignalRaw
- J1939ILGetAddress, J1939ILSetMsgEvent
- J1939ILSetMsgRawData, J1939ILSetMsgDA
- J1939ILSetNodeProperty, J1939ILSetLampStatus
- J1939ILControlStart, J1939ILControlStop
- J1939ILRequest

### 11. ISO11783 VT函数
- Iso11783IL_GetAddress, Iso11783IL_SetAddress
- Iso11783IL_OPLoad, Iso11783IL_OPDeleteObjectPool
- Iso11783IL_OPSetProperty, Iso11783IL_OPShowObject
- Iso11783IL_OPSetNumericValue
- Iso11783IL_PDDLoadDeviceDescription
- Iso11783IL_PDDSetParameter, Iso11783IL_PDDGetValuePhysical
- Iso11783IL_PDDSetValueRaw, Iso11783IL_PDDGetValueRaw
- Iso11783IL_PDDGetSectionState, Iso11783IL_PDDSetLogTrigger
- Iso11783IL_DelayRxMessage

### 12. ISO11783 TIM函数
- Iso11783IL_TIMConnectToServer, Iso11783IL_TIMDisconnectFromServer
- Iso11783IL_TIMSetProperty
- Iso11783IL_TIMSetSupportedFacility, Iso11783IL_TIMSetRequiredFacility
- Iso11783IL_TIMActivateServer, Iso11783IL_TIMDeactivateServer
- Iso11783IL_TIMAssignFunction, Iso11783IL_TIMFunctionRequest
- Iso11783IL_TIMGetFunctionState
- Iso11783IL_TIMOperatorEnable
- Iso11783IL_TIMAddCertificate, Iso11783IL_TIMSetPrivateKey
- Iso11783IL_TIMSetCRL, Iso11783IL_TIMRestartAuthentication
- Iso11783IL_SetVerbosity, Iso11783IL_TIMSaveLwATable

### 13. LIN函数
- lin_wakeup, lin_gotosleep
- this.lin_wasAwake, this.lin_isAwake
- this.lin_newMode, this.lin_oldMode
- this.lin_firstEventAfterWakeUp
- CCILIN_GetTableIndices
- ChkStart_NodeDead, ChkStart_LINRespToleranceViolation

### 14. CAN TP函数
- CanTpCreateConnection, CanTpSendData
- CanTpReceiveData, CanTpCloseConnection
- CanTpGetStatus

### 15. DoIP函数
- DoIP_AnnounceVehicle, DoIP_ConfigureVehicleAnnouncement
- DoIP_CloseConnection

### 16. IP/Ethernet函数
- IP_Endpoint, ip_Address, IP_Address
- OnTcpReceive, OnUdpReceive
- getIpAddrFromSv, ipGetLocalAddress
- ipSetStackParameter, syspar
- ethernetPacket, OnIpSendPrepare
- EthGetMacAddressAsNumber, ethernetport
- this.eth_type, this.hwPort
- this.source, this.destination, this.Length, this.Payload

### 17. SOME/IP函数
- SomeIpILControlStart, SomeIpILControlStop, SomeIpILControlInit
- SomeIpSetVerbosity, SomeIpSetProperty, SomeIpGetProperty
- SomeIpGetProvidedObjectHandle, SomeIpGetConsumedObjectHandle
- SomeIpCreateMessage, SomeIpReleaseMessage
- SomeIpGetMessageId, SomeIpGetLength
- SomeIpGetValueLong, SomeIpGetValueDWord, SomeIpGetValuePhys
- SomeIpSetValueLong, SomeIpSetReturnCode
- OnSomeIpProcessTxMessage, OnSomeIpProcessRxMessage

### 18. Car2x/C2x函数
- C2xGetTokenInt, C2xSetTokenInt
- C2xGetTokenInt64, C2xSetTokenInt64
- C2xGetTokenFloat, C2xSetTokenFloat
- C2xGetTokenString, C2xSetTokenString

### 19. vFlash函数
- vFlashInitialize, vFlashDeinitialize
- vFlashLoad, vFlashUnload
- vFlashStart, vFlashStop
- vFlashStartPackReprogramming
- vFlashGetLastErrorMessage
- vFlashProgramProgressCallback, vFlashStatusCallback

### 20. XCP函数
- xcpConnect, xcpDisconnect, xcpIsConnected
- xcpActivateMeasurementGroup
- xcpUpload, xcpDownload
- xcpSetCalPage, xcpGetCalPage
- xcpStartDAQ, xcpStopDAQ

### 21. Media/AVB函数
- MediaCreateAudioRenderer, MediaReleaseAudioRenderer
- MediaCreateSinkWriterFromUrl, MediaCreateSinkWriterFromMediaSink
- MediaReleaseSinkWriter
- MediaSetProperty, MediaGetProperty, MediaWrite
- MediaCheckHandleAndStopIfError, MediaStopIfError
- FileTalker_Open, SineGenerator_Start
- Iso11783IL_OPControlAudio, Iso11783IL_OPSetAudioVolume

### 22. Panel/Control函数
- putValueToControl, getValueFromControl
- setControlForeColor, setDefaultControlColors
- makeRGB

### 23. 硬件函数
- GetChannelHardwareMapping, InterfaceStatus
- xlSetLED, xlAcquireLED, xlReleaseLED
- CANFDLightSendCalibration

### 24. HV电源函数
- HV_source_set_U_DC, HV_source_set_I_DC
- HV_source_set_output, HV_source_reset
- HV_measure_DC_U, HV_measure_DC_I
- HV_measure_DC_U_VeriVolt
- HV_source_set_AC_frequency, HV_source_set_I_AC
- HV_source_get_max_I_AC, HV_source_perform_welding

### 25. CAN FD Light函数
- CANFDLightActivateCommander
- CANFDLightSendUnicast, CANFDLightSendBroadcast
- CANFDLightSendWakeup, CANFDLightSendGoToSleep

### 26. 状态获取函数
- Iso11783IL_OPGetState, Iso11783IL_GetState
- J1939ILGetState
- FrNm_GetState, Nm_GetState, UdpNm_GetState
- SCC_GetStateName

### 27. J1939常量
- kMalfunctionLamp, kAmberWarningLamp, kRedStopLamp, kProtectLamp
- kOn, kOff, k blink, kPermanentOn
- SetLampStatus
- kDM1, kDM2, kDM3

### 28. 事件处理器
- on diagRequest, on diagResponse
- on notifier, on error, on idle
- on sysvar, on sysvar_change, on sysvar_update

### 26. 消息对象属性
- this.dlc, this.dir, this.can, this.msgChannel
- this.busType, this.sa, this.da
- this.data, this.byte, this.word, this.dword, this.qword
- this.QWord, this.DWord, this.Time

### 27. FlexRay属性
- this.FR_SlotID, this.FR_Cycle
- this.FR_CycleOffset, this.FR_CycleRepetition
- this.FR_ChannelMask, this.FR_PayloadLength
- this.FR_correctionFailedCounter

### 28. 方向常量
- rx, RX, tx, TX, txrequest

### 29. 访问修饰符
- env, sysvar, sys, @sysvarMember
- msglist

## 统计信息
- 总函数/关键词数量: 650+
- 已遍历的.can文件数量: 100+
- 已遍历的目录: CANoe Sample Configurations 19.5.44

## 待继续探索的领域
- CANopen相关函数 (可能不是标准CAPL函数)
- FlexRay IL函数 (已添加基础属性)
- 更多诊断协议函数
- 传感器/IO函数

## 最新更新 (2026-04-16)
- 添加了CAN FD Light函数
- 添加了状态获取函数 (各种IL的GetState)
- 添加了J1939常量 (SetLampStatus相关)
- 添加了testWaitForDiagResponse
- 更新了VSIX包版本: 1.0.0