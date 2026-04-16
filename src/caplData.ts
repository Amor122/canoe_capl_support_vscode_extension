export const CAPL_FUNCTIONS: Record<string, string> = {
    // Output Functions
    'output': 'output(message);\n\nSends a message on the CAN (or other) bus.',
    'write': 'write("format", ...);\n\nWrites text to the Write window.',
    'writeLineEx': 'writeLineEx(target, severity, "format", ...);\n\nWrites formatted output with target and severity level.\ntarget: 0=all, 1=Capl, 2=Test, 3=Diagnostic\nseverity: 1=Info, 2=Warning, 3=Error',
    'writeDbgLvlPrefix': 'writeDbgLvlPrefix(level, "format", ...);\n\nWrites debug output with level threshold.',
    'setWriteDbgLevel': 'setWriteDbgLevel(level);\n\nSets debug output level threshold (0=off, 1=important, 2=verbose).',
    'elnl': 'elnl();\n\nWrites a newline to the Write window.',
    'elprintf': 'elprintf(category, "format", ...);\n\nWrites formatted output with category.',
    'elprintfex': 'elprintfex(category, level, "format", ...);\n\nWrites formatted output with category and level.',

    // Timer Functions
    'setTimer': 'setTimer(timerName, timeInMs);\n\nSets a timer with specified duration in milliseconds.',
    'setTimerSync': 'setTimerSync(timerName, timeInMs);\n\nSets a timer synchronously.',
    'setTimerCyclic': 'setTimerCyclic(timerName, cycleTime);\n\nSets a cyclic timer with specified cycle time.',
    'cancelTimer': 'cancelTimer(timerName);\n\nCancels an active timer.',
    'timer': 'timer timerName; or timer timerName(timeInMs);\n\nDeclares a timer variable (time in seconds).',
    'elapsed': 'elapsed(timerName);\n\nReturns elapsed time since timer started in ms.',
    'isTimerActive': 'isTimerActive(timerName);\n\nReturns true if timer is active.',

    // Value Access Functions
    'putValue': 'putValue(signalOrEnvVar, value);\n\nSets the value of a signal or environment variable.',
    'getValue': 'getValue(signalOrEnvVar);\n\nGets the value of a signal or environment variable.',
    'setWrite': 'setWrite(sysVarPath, value);\n\nSets the value of a system variable.',
    'getSignal': 'getSignal(message, signalName);\n\nGets signal value from a message object.',
    'setSignal': 'setSignal(message, signalName, value);\n\nSets signal value in a message object.',
    'this': 'this\n\nReference to the current message/event object in handler.',

    // Message Object Properties (this in on message handler)
    'this.dlc': 'this.dlc\n\nData length code (number of bytes).',
    'this.dir': 'this.dir\n\nDirection: RX, TX, or TXREQUEST.',
    'this.can': 'this.can\n\nCAN channel number.',
    'this.msgChannel': 'this.msgChannel\n\nMessage channel (same as can).',
    'this.busType': 'this.busType\n\nBus type (eCAN, eCAN_FD, etc.).',
    'this.sa': 'this.sa\n\nSource address.',
    'this.da': 'this.da\n\nDestination address.',
    'this.data': 'this.data[]\n\nMessage data bytes array.',
    'this.byte': 'this.byte(index)\n\nGets/sets byte at index from message data.',
    'this.word': 'this.word(index)\n\nGets/sets word (16-bit) at index.',
    'this.dword': 'this.dword(index)\n\nGets/sets dword (32-bit) at index.',
    'this.qword': 'this.qword(index)\n\nGets/sets qword (64-bit) at index.',
    'this.QWord': 'this.QWord\n\nMessage as 64-bit value.',
    'this.DWord': 'this.DWord\n\nMessage as 32-bit value.',
    'this.Time': 'this.Time\n\nMessage timestamp.',

    // FlexRay Message Properties
    'this.FR_SlotID': 'this.FR_SlotID\n\nFlexRay slot ID.',
    'this.FR_Cycle': 'this.FR_Cycle\n\nFlexRay cycle number.',
    'this.FR_CycleOffset': 'this.FR_CycleOffset\n\nFlexRay cycle offset.',
    'this.FR_CycleRepetition': 'this.FR_CycleRepetition\n\nFlexRay cycle repetition.',
    'this.FR_ChannelMask': 'this.FR_ChannelMask\n\nFlexRay channel mask.',
    'this.FR_PayloadLength': 'this.FR_PayloadLength\n\nFlexRay payload length.',
    'this.FR_correctionFailedCounter': 'this.FR_correctionFailedCounter\n\nCorrection failed counter.',

    // Message Data Access Functions
    'SetData': 'SetData(offset, data, count);\n\nSets message data bytes.',
    'GetData': 'GetData(buffer, offset, count);\n\nGets message data bytes.',
    'CompletePacket': 'CompletePacket();\n\nCompletes message for transmission.',

    // Direction Constants
    'rx': 'rx\n\nReceive direction constant.',
    'RX': 'RX\n\nReceive direction constant.',
    'tx': 'tx\n\nTransmit direction constant.',
    'TX': 'TX\n\nTransmit direction constant.',
    'txrequest': 'txrequest\n\nTransmit request direction constant.',

    // LIN Message Properties
    'this.lin_wasAwake': 'this.lin_wasAwake\n\nLIN was previously awake.',
    'this.lin_isAwake': 'this.lin_isAwake\n\nLIN is currently awake.',
    'this.lin_newMode': 'this.lin_newMode\n\nLIN new schedule mode.',
    'this.lin_oldMode': 'this.lin_oldMode\n\nLIN old schedule mode.',
    'this.lin_firstEventAfterWakeUp': 'this.lin_firstEventAfterWakeUp\n\nFirst event after wakeup.',

    // LIN Functions
    'lin_wakeup': 'lin_wakeup();\n\nSends LIN wakeup.',
    'lin_gotosleep': 'lin_gotosleep();\n\nSends LIN sleep.',
    'CCILIN_GetTableIndices': 'CCILIN_GetTableIndices(reqIdx, respIdx);\n\nGets table indices.',
    'ChkStart_NodeDead': 'ChkStart_NodeDead(node);\n\nStarts node dead check.',
    'ChkStart_LINRespToleranceViolation': 'ChkStart_LINRespToleranceViolation(node);',
    'ChkStart_LINRespErrorSignal': 'ChkStart_LINRespErrorSignal(node);',

    // System Variable Functions
    'sysGetVariableLong': 'sysGetVariableLong(sysvar::Namespace::Variable);\n\nGets long value from system variable.',
    'sysSetVariableLong': 'sysSetVariableLong(sysvar::Namespace::Variable, value);\n\nSets long value to system variable.',
    'sysGetVariableFloat': 'sysGetVariableFloat(sysvar::Namespace::Variable);\n\nGets float value from system variable.',
    'sysSetVariableFloat': 'sysSetVariableFloat(sysvar::Namespace::Variable, value);\n\nSets float value to system variable.',
    'sysGetVariableString': 'sysGetVariableString(sysvar::Namespace::Variable, buffer, size);\n\nGets string value from system variable.',
    'sysSetVariableString': 'sysSetVariableString(sysvar::Namespace::Variable, string);\n\nSets string value to system variable.',
    'sysGetVariableInt64': 'sysGetVariableInt64(sysvar::Namespace::Variable);\n\nGets int64 value from system variable.',
    'sysSetVariableInt64': 'sysSetVariableInt64(sysvar::Namespace::Variable, value);\n\nSets int64 value to system variable.',
    'sysGetVariableData': 'sysGetVariableData(sysvar::Namespace::Variable, buffer, size);\n\nGets variable data bytes.',
    'sysSetVariableData': 'sysSetVariableData(sysvar::Namespace::Variable, data, size);\n\nSets variable data bytes.',
    'sysBeginVariableStructUpdate': 'sysBeginVariableStructUpdate(sysvar::Namespace::Variable);\n\nBegins struct update.',
    'sysEndVariableStructUpdate': 'sysEndVariableStructUpdate(sysvar::Namespace::Variable);\n\nEnds struct update.',

    // IL Functions
    'ILSetOperationMode': 'ILSetOperationMode(channel, mode);\n\nSets the operation mode of the Interlock Layer.',
    'ILCanTxOff': 'ILCanTxOff();\n\nDisables CAN transmission.',
    'ILCanTxOn': 'ILCanTxOn();\n\nEnables CAN transmission.',

    // J1939 IL Functions
    'J1939ILSetSignal': 'J1939ILSetSignal(signalName, value);\n\nSets signal value in J1939 IL.',
    'J1939ILSetSignalRaw': 'J1939ILSetSignalRaw(signalName, rawValue);\n\nSets raw signal value in J1939 IL.',
    'J1939ILGetAddress': 'J1939ILGetAddress();\n\nGets J1939 source address.',
    'J1939ILSetMsgEvent': 'J1939ILSetMsgEvent(message);\n\nTriggers message event in J1939 IL.',
    'J1939ILSetMsgRawData': 'J1939ILSetMsgRawData(message, dlc, data[]);\n\nSets raw message data in J1939 IL.',
    'J1939ILSetMsgDA': 'J1939ILSetMsgDA(message, destinationAddress);\n\nSets message destination address.',
    'J1939ILSetNodeProperty': 'J1939ILSetNodeProperty(property, value);\n\nSets node property in J1939 IL.',
    'J1939ILSetLampStatus': 'J1939ILSetLampStatus(dm, lampStatus);\n\nSets DM lamp status.',
    'J1939ILControlStart': 'J1939ILControlStart();\n\nStarts J1939 IL.',
    'J1939ILControlStop': 'J1939ILControlStop();\n\nStops J1939 IL.',
    'J1939ILRequest': 'J1939ILRequest(pgn);\n\nSends J1939 request.',

    // ISO11783 IL Functions
    'Iso11783IL_GetAddress': 'Iso11783IL_GetAddress();\n\nGets ISO11783 source address.',
    'Iso11783IL_SetAddress': 'Iso11783IL_SetAddress(address);\n\nSets ISO11783 source address.',
    'Iso11783IL_OPLoad': 'Iso11783IL_OPLoad(filename);\n\nLoads object pool.',
    'Iso11783IL_OPDeleteObjectPool': 'Iso11783IL_OPDeleteObjectPool();\n\nDeletes object pool.',
    'Iso11783IL_OPSetProperty': 'Iso11783IL_OPSetProperty(property, value);\n\nSets VT property.',
    'Iso11783IL_OPShowObject': 'Iso11783IL_OPShowObject(objectId, visible);\n\nShows/hides object.',
    'Iso11783IL_OPSetNumericValue': 'Iso11783IL_OPSetNumericValue(objectId, value);\n\nSets numeric value.',
    'Iso11783IL_PDDLoadDeviceDescription': 'Iso11783IL_PDDLoadDeviceDescription(file);\n\nLoads device description.',
    'Iso11783IL_PDDSetParameter': 'Iso11783IL_PDDSetParameter(param, value);\n\nSets PDD parameter.',
    'Iso11783IL_PDDGetValuePhysical': 'Iso11783IL_PDDGetValuePhysical(ddi, el, value);\n\nGets physical value from PDD.',
    'Iso11783IL_PDDSetValuePhysical': 'Iso11783IL_PDDSetValuePhysical(ddi, el, value);\n\nSets physical value in PDD.',
    'Iso11783IL_PDDGetValueRaw': 'Iso11783IL_PDDGetValueRaw(ddi, el, value);\n\nGets raw value from PDD.',
    'Iso11783IL_PDDSetValueRaw': 'Iso11783IL_PDDSetValueRaw(ddi, el, value);\n\nSets raw value in PDD.',
    'Iso11783IL_PDDGetSectionState': 'Iso11783IL_PDDGetSectionState(ddi, el, state);\n\nGets section state.',
    'Iso11783IL_PDDSetLogTrigger': 'Iso11783IL_PDDSetLogTrigger(log, ddi, el, value);\n\nSets log trigger.',
    'Iso11783IL_DelayRxMessage': 'Iso11783IL_DelayRxMessage(pgn, sa, da, byte, count);\n\nDelays RX message.',

    // ISO11783 TIM Functions
    'Iso11783IL_TIMConnectToServer': 'Iso11783IL_TIMConnectToServer(address);\n\nConnects to TIM server.',
    'Iso11783IL_TIMDisconnectFromServer': 'Iso11783IL_TIMDisconnectFromServer(address, graceful);\n\nDisconnects from server.',
    'Iso11783IL_TIMSetProperty': 'Iso11783IL_TIMSetProperty(property, value);\n\nSets TIM property.',
    'Iso11783IL_TIMSetSupportedFacility': 'Iso11783IL_TIMSetSupportedFacility(facility, value);\n\nSets supported facility.',
    'Iso11783IL_TIMSetRequiredFacility': 'Iso11783IL_TIMSetRequiredFacility(facility, value);\n\nSets required facility.',
    'Iso11783IL_TIMActivateServer': 'Iso11783IL_TIMActivateServer();\n\nActivates TIM server.',
    'Iso11783IL_TIMDeactivateServer': 'Iso11783IL_TIMDeactivateServer(graceful);\n\nDeactivates TIM server.',
    'Iso11783IL_TIMAssignFunction': 'Iso11783IL_TIMAssignFunction(functionId, server);\n\nAssigns function.',
    'Iso11783IL_TIMFunctionRequest': 'Iso11783IL_TIMFunctionRequest(functionId, value);\n\nRequests function value.',
    'Iso11783IL_TIMGetFunctionState': 'Iso11783IL_TIMGetFunctionState(functionId, state);\n\nGets function state.',
    'Iso11783IL_TIMOperatorEnable': 'Iso11783IL_TIMOperatorEnable(server);\n\nEnables operator.',
    'Iso11783IL_TIMAddCertificate': 'Iso11783IL_TIMAddCertificate(type, file);\n\nAdds certificate.',
    'Iso11783IL_TIMSetPrivateKey': 'Iso11783IL_TIMSetPrivateKey(file);\n\nSets private key.',
    'Iso11783IL_TIMSetCRL': 'Iso11783IL_TIMSetCRL(type, file);\n\nSets CRL.',
    'Iso11783IL_TIMRestartAuthentication': 'Iso11783IL_TIMRestartAuthentication(server);\n\nRestarts authentication.',
    'Iso11783IL_SetVerbosity': 'Iso11783IL_SetVerbosity(level);',
    'Iso11783IL_TIMSaveLwATable': 'Iso11783IL_TIMSaveLwATable(file);',
    'Iso11783IL_TIMClearLwATable': 'Iso11783IL_TIMClearLwATable();\n\nClears LwA table.',

    // Test Functions
    'testcase': 'testcase name { ... }\n\nDefines a test case (must be inside a test function).',
    'testfunction': 'testfunction name { ... }\n\nDefines a test function.',
    'testwait': 'testwait(condition, timeoutMs);\n\nWaits for a condition with timeout in milliseconds.',
    'testassert': 'testassert(condition, "message");\n\nAsserts a condition, reports message if failed.',
    'teststep': 'teststep(name, "description");\n\nDefines a test step within a test case.',
    'testreport': 'testreport(message, result);\n\nReports test result.',
    'testconfig': 'testconfig(name);\n\nSets test configuration.',
    'TestStepPass': 'TestStepPass(title, "message");\n\nReports a passed test step.',
    'TestStepFail': 'TestStepFail(title, "message");\n\nReports a failed test step.',
    'TestStatus': 'TestStatus("message");\n\nReports test status message.',
    'TestCommandBegin': 'TestCommandBegin(type, command, title, value);\n\nBegins a test command.',
    'TestCommandEnd': 'TestCommandEnd(result);\n\nEnds a test command.',

    // Extended Test Functions
    'testWaitForSignalMatch': 'testWaitForSignalMatch(signal, value, timeout);\n\nWaits for signal to match value.',
    'testWaitForSignalInRange': 'testWaitForSignalInRange(signal, min, max, timeout);\n\nWaits for signal in range.',
    'testWaitForTextEvent': 'testWaitForTextEvent(text, timeout);\n\nWaits for text event.',
    'testSupplyTextEvent': 'testSupplyTextEvent(text);\n\nSupplies text event.',
    'testWaitForDiagResponse': 'testWaitForDiagResponse(req, timeout);\n\nWaits for diagnostic response.',
    'TestWaitForDiagResponse': 'TestWaitForDiagResponse(req, timeout);\n\nWaits for diagnostic response.',

    // Test Report Functions
    'testReportAddEngineerInfo': 'testReportAddEngineerInfo(title, value);\n\nAdds engineer info to test report.',
    'testReportAddSUTInfo': 'testReportAddSUTInfo(title, value);\n\nAdds SUT info to test report.',
    'testReportAddMiscInfoBlock': 'testReportAddMiscInfoBlock(blockName);\n\nAdds misc info block to test report.',
    'testReportAddMiscInfo': 'testReportAddMiscInfo(title, value);\n\nAdds misc info to test report.',
    'testReportWriteDiagObject': 'testReportWriteDiagObject(req);\n\nWrites diagnostic object to test report.',
    'testReportWriteDiagResponse': 'testReportWriteDiagResponse(resp);\n\nWrites diagnostic response to test report.',
    'testReportAddWindowCapture': 'testReportAddWindowCapture(panel, control, caption);\n\nAdds window capture to test report.',
    'testReportCreateRecordingGroup': 'testReportCreateRecordingGroup(name);\n\nCreates recording group.',
    'testReportAddToRecordingGroup': 'testReportAddToRecordingGroup(handle, signal);\n\nAdds signal to recording group.',
    'testReportStartRecordingGroup': 'testReportStartRecordingGroup(handle);\n\nStarts recording group.',
    'testReportStopRecordingGroup': 'testReportStopRecordingGroup(handle);\n\nStops recording group.',
    'testReportStartRecording': 'testReportStartRecording(signal);\n\nStarts signal recording.',
    'testReportStopRecording': 'testReportStopRecording(signal);\n\nStops signal recording.',
    'testReportStopAllRecordings': 'testReportStopAllRecordings();\n\nStops all recordings.',

    // Math Functions
    'sqrt': 'sqrt(value);\n\nCalculates the square root.',
    'abs': 'abs(value);\n\nCalculates absolute value.',
    'sin': 'sin(angle);\n\nCalculates sine (angle in radians).',
    'cos': 'cos(angle);\n\nCalculates cosine (angle in radians).',
    'tan': 'tan(angle);\n\nCalculates tangent (angle in radians).',
    'asin': 'asin(value);\n\nCalculates arcsine (result in radians).',
    'acos': 'acos(value);\n\nCalculates arccosine (result in radians).',
    'atan': 'atan(value);\n\nCalculates arctangent (result in radians).',
    'atan2': 'atan2(y, x);\n\nCalculates arctangent with quadrant correction.',
    'log': 'log(value);\n\nCalculates natural logarithm.',
    'log10': 'log10(value);\n\nCalculates base-10 logarithm.',
    'exp': 'exp(value);\n\nCalculates exponential (e^x).',
    'pow': 'pow(base, exponent);\n\nCalculates power (base^exponent).',
    'floor': 'floor(value);\n\nRounds down to nearest integer.',
    'ceil': 'ceil(value);\n\nRounds up to nearest integer.',
    'round': 'round(value);\n\nRounds to nearest integer.',

    // Extended Math Functions (with underscore prefix)
    '_max': '_max(val1, val2);\n\nReturns maximum of two values.',
    '_min': '_min(val1, val2);\n\nReturns minimum of two values.',
    '_round': '_round(value);\n\nRounds to nearest integer (extended form).',
    '_ceil': '_ceil(value);\n\nRounds up (extended form).',
    '_floor': '_floor(value);\n\nRounds down (extended form).',
    '_pow': '_pow(base, exponent);\n\nCalculates power (extended form).',
    '_sqrt': '_sqrt(value);\n\nCalculates square root (extended form).',
    '_abs': '_abs(value);\n\nCalculates absolute value (extended form).',
    '_sign': '_sign(value);\n\nReturns sign (-1, 0, or 1).',

// String Functions
    'strlen': 'strlen(string);\n\nReturns the length of a string.',
    'strcpy': 'strcpy(destination, source);\n\nCopies source string to destination.',
    'strcat': 'strcat(destination, source);\n\nConcatenates source to end of destination.',
    'strncpy': 'strncpy(destination, source, count);\n\nCopies up to count characters.',
    'strncat': 'strncat(destination, source, count);\n\nConcatenates up to count characters.',
    'strcmp': 'strcmp(string1, string2);\n\nCompares strings (returns 0 if equal).',
    'strncmp': 'strncmp(string1, string2, count);\n\nCompares first n characters.',
    'strchr': 'strchr(string, character);\n\nFinds first occurrence of character.',
    'strstr': 'strstr(haystack, needle);\n\nFinds substring (returns position or -1).',
    'strrchr': 'strrchr(string, character);\n\nfinds last occurrence of character.',
    'sprintf': 'sprintf(buffer, "format", ...);\n\nFormats and stores string in buffer.',
    'sscanf': 'sscanf(string, "format", ...);\n\nParses formatted string.',
    'atoi': 'atoi(string);\n\nConverts string to integer.',
    'atof': 'atof(string);\n\nConverts string to float.',
    'atol': 'atol(string);\n\nConverts string to long integer.',
    'tolower': 'tolower(character);\n\nConverts character to lowercase.',
    'toupper': 'toupper(character);\n\nConverts character to uppercase.',

    // Multibyte String Functions
    'mbstrlen': 'mbstrlen(string);\n\nReturns multibyte string length.',

    // Memory Functions
    'memset': 'memset(buffer, value, size);\n\nFills buffer with value.',
    'memcpy': 'memcpy(destination, source, size);\n\nCopies memory area.',
    'memcmp': 'memcmp(buffer1, buffer2, size);\n\nCompares memory areas.',
    'memmove': 'memmove(destination, source, size);\n\nMoves memory (handles overlap).',
    'elcount': 'elcount(array);\n\nReturns number of elements in array.',

    // File Functions
    'filemap': 'filemap(filename);\n\nMaps a file for CAPL access.',
    'fileclose': 'fileclose(fileHandle);\n\nCloses a file.',
    'fileread': 'fileread(fileHandle, buffer, bytesToRead);\n\nReads from file into buffer.',
    'filewrite': 'filewrite(fileHandle, buffer, bytesToWrite);\n\nWrites buffer to file.',
    'filegetc': 'filegetc(fileHandle);\n\nGets next character from file.',
    'fileputc': 'fileputc(fileHandle, character);\n\nWrites character to file.',
    'filesetpos': 'filesetpos(fileHandle, position);\n\nSets file position.',
    'filegetpos': 'filegetpos(fileHandle);\n\nGets current file position.',

    // Logging Functions
    'logClose': 'logClose();\n\nCloses the logging block.',
    'logOpen': 'logOpen(filename);\n\nOpens a logging block.',
    'logReset': 'logReset();\n\nResets the logging configuration.',
    'logWrite': 'logWrite(message);\n\nWrites to logging output.',

    // Hardware Functions
    'GetChannelHardwareMapping': 'GetChannelHardwareMapping(channel, busType);\n\nGets hardware mapping for channel.',
    'InterfaceStatus': 'InterfaceStatus();\n\nCallback for interface status changes.',
    'xlSetLED': 'xlSetLED(device, led, state);\n\nSets LED state on hardware.',
    'xlAcquireLED': 'xlAcquireLED(device, led);\n\nAcquires LED for control.',
    'xlReleaseLED': 'xlReleaseLED(device, led);\n\nReleases LED control.',

    // HV Source (Power Supply) Functions
    'HV_source_set_U_DC': 'HV_source_set_U_DC(voltage);\n\nSets DC voltage.',
    'HV_source_set_I_DC': 'HV_source_set_I_DC(current);\n\nSets DC current.',
    'HV_source_set_output': 'HV_source_set_output(enable);\n\nEnables/disables output.',
    'HV_source_reset': 'HV_source_reset();\n\nResets HV source.',
    'HV_measure_DC_U': 'HV_measure_DC_U();\n\nMeasures DC voltage.',
    'HV_measure_DC_I': 'HV_measure_DC_I();\n\nMeasures DC current.',
    'HV_measure_DC_U_VeriVolt': 'HV_measure_DC_U_VeriVolt();\n\nMeasures verified DC voltage.',
    'HV_source_set_AC_frequency': 'HV_source_set_AC_frequency();\n\nSets AC frequency.',
    'HV_source_set_I_AC': 'HV_source_set_I_AC(current);\n\nSets AC current.',
    'HV_source_get_max_I_AC': 'HV_source_get_max_I_AC();\n\nGets max AC current.',
    'HV_source_perform_welding': 'HV_source_perform_welding();\n\nPerforms welding test.',

    // Panel Functions
    'openPanel': 'openPanel(panelName);\n\nOpens a panel.',
    'closePanel': 'closePanel(panelName);\n\nCloses a panel.',
    'enableControl': 'enableControl(panelName, controlName, enable);\n\nEnables or disables a control.',
    'SetControlProperty': 'SetControlProperty(panelName, controlName, property, value);\n\nSets control property value.',
    'SetControlVisibility': 'SetControlVisibility(panelName, controlName, visible);\n\nSets control visibility.',

    // Byte Swapping Functions
    'swapWord': 'swapWord(value);\n\nSwaps bytes of 16-bit value.',
    'swapInt': 'swapInt(value);\n\nSwaps bytes of 32-bit integer.',
    'swapInt64': 'swapInt64(value);\n\nSwaps bytes of 64-bit integer.',
    'swapDWord': 'swapDWord(value);\n\nSwaps bytes of double word.',
    'swapQWord': 'swapQWord(value);\n\nSwaps bytes of quad word.',

    // Database Functions
    'dbGetSymbol': 'dbGetSymbol(symbolName);\n\nGets symbol from database.',
    'dbGetMessage': 'dbGetMessage(msgName);\n\nGets message from database.',
    'dbGetSignal': 'dbGetSignal(sigName);\n\nGets signal from database.',

    // Diagnostic Functions
    'diagGetCommParameter': 'diagGetCommParameter(parameterName);\n\nGets diagnostic communication parameter.',

    // DoIP Functions
    'DoIP_AnnounceVehicle': 'DoIP_AnnounceVehicle();\n\nAnnounces DoIP vehicle.',
    'DoIP_ConfigureVehicleAnnouncement': 'DoIP_ConfigureVehicleAnnouncement(channel, count, interval);\n\nConfigures vehicle announcement.',
    'DoIP_CloseConnection': 'DoIP_CloseConnection();\n\nCloses DoIP connection.',

    // IP/Ethernet Functions
    'IP_Endpoint': 'IP_Endpoint(address);\n\nCreates IP endpoint (address:port).',
    'ip_Address': 'ip_Address ip;\n\nIP address type.',
    'IP_Address': 'IP_Address ip;\n\nIP address type.',
    'OnTcpReceive': 'OnTcpReceive(socket, result, endpoint, buffer, size) { ... }\n\nTCP receive callback.',
    'OnUdpReceive': 'OnUdpReceive(socket, result, endpoint, buffer, size) { ... }\n\nUDP receive callback.',
    'getIpAddrFromSv': 'getIpAddrFromSv(sysvar, ipAddr);\n\nGets IP address from system variable.',
    'ipGetLocalAddress': 'ipGetLocalAddress();\n\nGets local IP address.',
    'ipSetStackParameter': 'ipSetStackParameter(param, value);\n\nSets IP stack parameter.',
    'syspar': 'syspar::Name\n\nSystem parameter (IP config).',

    // SOME/IP Functions
    'SomeIpILControlStart': 'SomeIpILControlStart();\n\nStarts SOME/IP IL.',
    'SomeIpILControlStop': 'SomeIpILControlStop();\n\nStops SOME/IP IL.',
    'SomeIpILControlInit': 'SomeIpILControlInit();\n\nInitializes SOME/IP IL.',
    'SomeIpSetVerbosity': 'SomeIpSetVerbosity(level);\n\nSets SOME/IP verbosity.',
    'SomeIpSetProperty': 'SomeIpSetProperty(handle, property, value);\n\nSets SOME/IP property.',
    'SomeIpGetProperty': 'SomeIpGetProperty(handle, property);\n\nGets SOME/IP property.',
    'SomeIpGetProvidedObjectHandle': 'SomeIpGetProvidedObjectHandle(name);\n\nGets provided object handle.',
    'SomeIpGetConsumedObjectHandle': 'SomeIpGetConsumedObjectHandle(name);\n\nGets consumed object handle.',
    'SomeIpCreateMessage': 'SomeIpCreateMessage(length, data);\n\nCreates SOME/IP message.',
    'SomeIpReleaseMessage': 'SomeIpReleaseMessage(handle);\n\nReleases message.',
    'SomeIpGetMessageId': 'SomeIpGetMessageId(handle);\n\nGets message ID.',
    'SomeIpGetLength': 'SomeIpGetLength(handle);\n\nGets message length.',
    'SomeIpGetValueLong': 'SomeIpGetValueLong(handle, path);\n\nGets long value from message.',
    'SomeIpGetValueDWord': 'SomeIpGetValueDWord(handle, path);\n\nGets dword value from message.',
    'SomeIpGetValuePhys': 'SomeIpGetValuePhys(handle, path);\n\nGets physical value from message.',
    'SomeIpSetValueLong': 'SomeIpSetValueLong(handle, path, value);\n\nSets long value in message.',
    'SomeIpSetReturnCode': 'SomeIpSetReturnCode(handle, code);\n\nSets return code.',
    'OnSomeIpProcessTxMessage': 'OnSomeIpProcessTxMessage(handle, channel) { ... }\n\nTX message callback.',
    'OnSomeIpProcessRxMessage': 'OnSomeIpProcessRxMessage(handle, channel) { ... }\n\nRX message callback.',

    // Car2x/C2x Functions
    'C2xGetTokenInt': 'C2xGetTokenInt(packet, layer, token);\n\nGets int token from C2x packet.',
    'C2xSetTokenInt': 'C2xSetTokenInt(packet, layer, token, value);\n\nSets int token in C2x packet.',
    'C2xGetTokenInt64': 'C2xGetTokenInt64(packet, layer, token);\n\nGets int64 token from C2x packet.',
    'C2xSetTokenInt64': 'C2xSetTokenInt64(packet, layer, token, value);\n\nSets int64 token in C2x packet.',
    'C2xGetTokenFloat': 'C2xGetTokenFloat(packet, layer, token);\n\nGets float token from C2x packet.',
    'C2xSetTokenFloat': 'C2xSetTokenFloat(packet, layer, token, value);\n\nSets float token in C2x packet.',
    'C2xGetTokenString': 'C2xGetTokenString(packet, layer, token, buffer);\n\nGets string token from C2x packet.',
    'C2xSetTokenString': 'C2xSetTokenString(packet, layer, token, string);\n\nSets string token in C2x packet.',

    // Ethernet Packet Functions
    'ethernetPacket': 'ethernetPacket packet;\n\nEthernet packet type.',
    'OnIpSendPrepare': 'OnIpSendPrepare(socket, packet) { ... }\n\nCalled before IP packet send.',
    'EthGetMacAddressAsNumber': 'EthGetMacAddressAsNumber(macString);\n\nConverts MAC string to number.',
    'ethernetport': 'ethernetport::Name\n\nEthernet port type.',
    'this.eth_type': 'this.eth_type\n\nEthernet type field.',
    'this.hwPort': 'this.hwPort\n\nHardware port.',
    'this.source': 'this.source\n\nSource MAC address.',
    'this.destination': 'this.destination\n\nDestination MAC address.',
    'this.Length': 'this.Length\n\nPacket length.',
    'this.Payload': 'this.Payload[]\n\nEthernet payload data.',
    'diagGetP2Timeout': 'diagGetP2Timeout(ecu, channel, p2Index);\n\nGets P2 timeout for diagnostic session.',
    'diagGetP2Extended': 'diagGetP2Extended(ecu, channel, p2Index);\n\nGets P2 Extended timeout for diagnostic session.',
    'diagRequest': 'diagRequest(requestName);\n\nCreates and sends diagnostic request.',
    'diagResponse': 'diagResponse(responseName);\n\nCreates diagnostic response object.',
    'diagSendRequest': 'diagSendRequest(request);\n\nSends diagnostic request.',
    'diagGetLastResponse': 'diagGetLastResponse();\n\nGets last diagnostic response.',
    'diagGetLastResponseCode': 'diagGetLastResponseCode(req);\n\nGets last diagnostic response code.',
    'diagSetParameter': 'diagSetParameter(req, parameter, value);\n\nSets diagnostic request parameter.',
    'diagGetParameter': 'diagGetParameter(req, parameter);\n\nGets diagnostic request parameter.',
    'diagIsPositiveResponse': 'diagIsPositiveResponse(resp);\n\nChecks if diagnostic response is positive.',
    'diagSendPositiveResponse': 'diagSendPositiveResponse(resp);\n\nSends positive diagnostic response.',
    'diagSendNegativeResponse': 'diagSendNegativeResponse(resp, code);\n\nSends negative diagnostic response with NRC code.',
    'diagSendResponse': 'diagSendResponse(resp);\n\nSends diagnostic response.',
    'diagStartSecurityTask': 'diagStartSecurityTask(ecu, algorithm, key, options);\n\nStarts security access task.',
    'diagStartTesterPresent': 'diagStartTesterPresent(ecu);\n\nStarts tester present keep-alive.',
    'diagSetPrimitiveByte': 'diagSetPrimitiveByte(resp, index, value);\n\nSets primitive byte in response.',
    'diagSetComplexParameter': 'diagSetComplexParameter(resp, name, index, param, value);\n\nSets complex parameter at index.',
    'diagGetPrimitiveByte': 'diagGetPrimitiveByte(resp, index);\n\nGets primitive byte from response.',
    'diagCheckLen': 'diagCheckLen(resp, length);\n\nChecks response data length.',
    'diagGetRawData': 'diagGetRawData(resp, buffer, offset, length);\n\nGets raw data from diagnostic response.',
    'DiagGetParameter': 'DiagGetParameter(this, parameterName);\n\nGets parameter value from diagnostic object (this).',
    'DiagSetParameter': 'DiagSetParameter(resp, parameterName, value);\n\nSets parameter in diagnostic response object.',
    'GetParameter': 'GetParameter(parameterName);\n\nGets parameter from diagnostic request/response object.',
    'SetParameter': 'SetParameter(parameterName, value);\n\nSets parameter in diagnostic request object.',
    'IsPositiveResponse': 'IsPositiveResponse();\n\nChecks if diagnostic response is positive.',
    'SendRequest': 'SendRequest();\n\nSends diagnostic request.',
    'SendFunctional': 'SendFunctional();\n\nSends functional group request.',
    'GetResponseData': 'GetResponseData(buffer, offset, length);\n\nGets response data bytes.',
    'GetResponseCode': 'GetResponseCode();\n\nGets response code from diagnostic response.',

    // Time Functions
    'timeNow': 'timeNow();\n\nReturns current time in nanoseconds.',
    'timeNowNS': 'timeNowNS();\n\nReturns current time in nanoseconds.',
    'timeNowUS': 'timeNowUS();\n\nReturns current time in microseconds.',
    'timeNowMS': 'timeNowMS();\n\nReturns current time in milliseconds.',
    'timeNowInt64': 'timeNowInt64();\n\nReturns current time as int64 in nanoseconds.',

    // Random Functions
    'random': 'random(max);\n\nReturns random number in range [0, max).',
    'rand': 'rand();\n\nReturns random integer.',
    'srand': 'srand(seed);\n\nSets random seed.',

    // Panel/Control Functions
    'putValueToControl': 'putValueToControl(panel, control, text);\n\nSets text value of control.',
    'getValueFromControl': 'getValueFromControl(panel, control);\n\nGets text value from control.',
    'setControlForeColor': 'setControlForeColor(panel, control, color);\n\nSets foreground color of control.',
    'setDefaultControlColors': 'setDefaultControlColors(panel);\n\nResets control colors to default.',
    'makeRGB': 'makeRGB(r, g, b);\n\nCreates RGB color value.',

    // CAN TP Functions
    'CanTpCreateConnection': 'CanTpCreateConnection(channel);\n\nCreates CAN TP connection.',
    'CanTpSendData': 'CanTpSendData(handle, data, size);\n\nSends data via CAN TP.',
    'CanTpReceiveData': 'CanTpReceiveData(handle, data);\n\nReceives data via CAN TP.',
    'CanTpCloseConnection': 'CanTpCloseConnection(handle);\n\nCloses CAN TP connection.',
    'CanTpGetStatus': 'CanTpGetStatus(handle);\n\nGets CAN TP status.',

    // vFlash Functions
    'vFlashInitialize': 'vFlashInitialize();\n\nInitializes vFlash.',
    'vFlashLoad': 'vFlashLoad(packFile);\n\nLoads flash pack.',
    'vFlashStart': 'vFlashStart();\n\nStarts flashing.',
    'vFlashStop': 'vFlashStop();\n\nStops flashing.',
    'vFlashUnload': 'vFlashUnload();\n\nUnloads flash pack.',
    'vFlashDeinitialize': 'vFlashDeinitialize();\n\nDeinitializes vFlash.',
    'vFlashStartPackReprogramming': 'vFlashStartPackReprogramming(packFile);\n\nStarts pack reprogramming.',
    'TestWaitForvFlashPackReprogrammed': 'TestWaitForvFlashPackReprogrammed(packFile);\n\nWaits for reprogramming.',
    'vFlashGetLastErrorMessage': 'vFlashGetLastErrorMessage();\n\nGets last error message.',
    'vFlashProgramProgressCallback': 'vFlashProgramProgressCallback(progress, remaining) { ... }\n\nProgress callback.',
    'vFlashStatusCallback': 'vFlashStatusCallback(status) { ... }\n\nStatus callback.',
    'CANFDLightSendCalibration': 'CANFDLightSendCalibration(channel, length);\n\nSends calibration.',
    'CANFDLightActivateCommander': 'CANFDLightActivateCommander(channel, enable);\n\nActivates CAN FD Light commander.',
    'CANFDLightSendUnicast': 'CANFDLightSendUnicast(channel, address, data, length);\n\nSends unicast frame.',
    'CANFDLightSendBroadcast': 'CANFDLightSendBroadcast(channel, address, data, length);\n\nSends broadcast frame.',
    'CANFDLightSendWakeup': 'CANFDLightSendWakeup(channel);\n\nSends wakeup frame.',
    'CANFDLightSendGoToSleep': 'CANFDLightSendGoToSleep(channel);\n\nSends go to sleep frame.',

    // XCP Functions
    'xcpConnect': 'xcpConnect(deviceName);\n\nConnects to XCP device.',
    'xcpDisconnect': 'xcpDisconnect(deviceName);\n\nDisconnects from XCP device.',
    'xcpIsConnected': 'xcpIsConnected(deviceName);\n\nChecks if connected.',
    'xcpActivateMeasurementGroup': 'xcpActivateMeasurementGroup(deviceName, group);\n\nActivates measurement group.',
    'xcpUpload': 'xcpUpload(deviceName, address, size);\n\nUploads data from device.',
    'xcpDownload': 'xcpDownload(deviceName, address, data[]);\n\nDownloads data to device.',
    'xcpSetCalPage': 'xcpSetCalPage(deviceName, page);\n\nSets calibration page.',
    'xcpGetCalPage': 'xcpGetCalPage(deviceName);\n\nGets calibration page.',
    'xcpStartDAQ': 'xcpStartDAQ(deviceName);\n\nStarts DAQ.',
    'xcpStopDAQ': 'xcpStopDAQ(deviceName);\n\nStops DAQ.',

    // J1939 Constants
    'kMalfunctionLamp': 'kMalfunctionLamp\n\nMalfunction lamp constant.',
    'kAmberWarningLamp': 'kAmberWarningLamp\n\nAmber warning lamp constant.',
    'kRedStopLamp': 'kRedStopLamp\n\nRed stop lamp constant.',
    'kProtectLamp': 'kProtectLamp\n\nProtect lamp constant.',
    'kOn': 'kOn\n\nLamp on constant.',
    'kOff': 'kOff\n\nLamp off constant.',
    'k blink': 'k blink\n\nLamp blink constant.',
    'kPermanentOn': 'kPermanentOn\n\nPermanent on constant.',
    'SetLampStatus': 'SetLampStatus(lamp, state, type);\n\nCreates lamp status value.',
    'kDM1': 'kDM1\n\nDM1 diagnostic message.',
    'kDM2': 'kDM2\n\nDM2 diagnostic message.',
    'kDM3': 'kDM3\n\nDM3 diagnostic message.',

    // State Functions
    'Iso11783IL_OPGetState': 'Iso11783IL_OPGetState();\n\nGets VT operation state.',
    'Iso11783IL_GetState': 'Iso11783IL_GetState();\n\nGets ISO11783 state.',
    'J1939ILGetState': 'J1939ILGetState();\n\nGets J1939 IL state.',
    'FrNm_GetState': 'FrNm_GetState();\n\nGets FlexRay NM state.',
    'Nm_GetState': 'Nm_GetState();\n\nGets CAN NM state.',
    'UdpNm_GetState': 'UdpNm_GetState();\n\nGets UDP NM state.',
    'SCC_GetStateName': 'SCC_GetStateName(state, buffer, size);\n\nGets state name string.',

    // Media/AVB Functions
    'MediaCreateAudioRenderer': 'MediaCreateAudioRenderer();\n\nCreates audio renderer.',
    'MediaReleaseAudioRenderer': 'MediaReleaseAudioRenderer(handle);\n\nReleases audio renderer.',
    'MediaCreateSinkWriterFromUrl': 'MediaCreateSinkWriterFromUrl(url);\n\nCreates sink writer from URL.',
    'MediaCreateSinkWriterFromMediaSink': 'MediaCreateSinkWriterFromMediaSink(sink);\n\nCreates sink writer.',
    'MediaReleaseSinkWriter': 'MediaReleaseSinkWriter(handle);\n\nReleases sink writer.',
    'MediaSetProperty': 'MediaSetProperty(handle, property, value);\n\nSets media property.',
    'MediaGetProperty': 'MediaGetProperty(handle, property);\n\nGets media property.',
    'MediaWrite': 'MediaWrite(handle, data, size);\n\nWrites media data.',
    'MediaCheckHandleAndStopIfError': 'MediaCheckHandleAndStopIfError(handle, func);\n\nChecks handle.',
    'MediaStopIfError': 'MediaStopIfError(ret, func);\n\nChecks return value.',
    'FileTalker_Open': 'FileTalker_Open(vlanId, streamId, file, index, loop);\n\nOpens file talker.',
    'SineGenerator_Start': 'SineGenerator_Start(frequency, amplitude);\n\nStarts sine generator.',
    'Iso11783IL_OPControlAudio': 'Iso11783IL_OPControlAudio(freq, onTime, offTime);\n\nControls audio output.',
    'Iso11783IL_OPSetAudioVolume': 'Iso11783IL_OPSetAudioVolume(volume);\n\nSets audio volume.',
    'sleep': 'sleep(delayMs);\n\nSuspends execution for specified time (ms).',

    // Conversion Functions
    'floatToInt': 'floatToInt(value);\n\nConverts float to integer bits.',
    'intToFloat': 'intToFloat(value);\n\nConverts integer bits to float.',
    'hex': 'hex(value);\n\nConverts to hexadecimal string.',
    'dec': 'dec(value);\n\nConverts to decimal string.'
};

export const CAPL_KEYWORDS: Record<string, string> = {
    // Control flow
    'if': 'if (condition) { ... }\n\nConditional statement - executes code if condition is true.',
    'else': 'else { ... }\n\nExecutes when if condition is false.',
    'switch': 'switch (expression) { ... }\n\nMulti-way branch statement.',
    'case': 'case constant: \n\nLabel in switch statement.',
    'default': 'default: \n\nDefault label in switch statement.',
    'while': 'while (condition) { ... }\n\nLoops while condition is true.',
    'do': 'do { ... } while (condition);\n\nLoops at least once, then checks condition.',
    'for': 'for (init; condition; increment) { ... }\n\nCounting loop.',
    'break': 'break;\n\nExits the nearest loop or switch.',
    'continue': 'continue;\n\nSkips to next iteration of loop.',
    'return': 'return [value];\n\nReturns from function.',
    'goto': 'goto label;\n\nJumps to labeled statement.',

    // Storage specifiers
    'const': 'const\n\nRead-only variable modifier.',
    'volatile': 'volatile\n\nPrevents optimization of variable.',
    'extern': 'extern\n\nDeclares external variable.',
    'static': 'static\n\nStatic storage duration.',

    // Event procedures
    'onstart': 'onstart() { ... }\n\nCalled when measurement starts.',
    'on start': 'on start { ... }\n\nCalled when measurement starts (alternative syntax).',
    'onstop': 'onstop() { ... }\n\nCalled when measurement stops.',
    'on stop': 'on stop { ... }\n\nCalled when measurement stops (alternative syntax).',
    'onerror': 'onerror() { ... }\n\nCalled when an error occurs.',
    'on key': 'on key keyIdentifier { ... }\n\nCalled when specific key is pressed.\nExample: on key \'a\', on key F1, on key *',
    'onmessage': 'onmessage msgName { ... }\n\nCalled when specific message is received.',
    'on message': 'on message msgName { ... }\n\nCalled when message is received.',
    'ontimer': 'ontimer timerName { ... }\n\nCalled when timer expires.',
    'on timer': 'on timer timerName { ... }\n\nCalled when timer expires.',
    'onpretrigger': 'onpretrigger() { ... }\n\nCalled before trigger condition.',
    'ontrigger': 'ontrigger() { ... }\n\nCalled when trigger condition occurs.',
    'on preStart': 'on preStart { ... }\n\nCalled before measurement starts.',
    'on preStop': 'on preStop { ... }\n\nCalled before measurement stops.',
    'on sysvar': 'on sysvar namespace::variable { ... }\n\nCalled when system variable changes.',
    'on sysVar': 'on sysVar namespace::variable { ... }\n\nCalled when system variable changes.',
    'on sysVar_change': 'on sysVar_change namespace::variable { ... }\n\nCalled when system variable value changes.',
    'on sysVar_update': 'on sysVar_update namespace::variable { ... }\n\nCalled when system variable is updated.',
    'on pdu': 'on pdu pduName { ... }\n\nCalled when specific PDU is received.',
    'on envvar': 'on envvar name { ... }\n\nCalled when environment variable changes.',
    'on env': 'on env name { ... }\n\nCalled when environment variable changes.',
    'on diagRequest': 'on diagRequest requestName { ... }\n\nCalled when diagnostic request is received.',
    'on diagResponse': 'on diagResponse responseName { ... }\n\nCalled when diagnostic response is received.',
    'on notifier': 'on notifier variable { ... }\n\nCalled when environment variable notifier triggers.',
    'on error': 'on error { ... }\n\nCalled when error occurs.',
    'on idle': 'on idle { ... }\n\nCalled when there are no messages to process.',

    // Types - Primitive
    'void': 'void\n\nNo return value / no type.',
    'int': 'int\n\n32-bit signed integer.',
    'long': 'long\n\n32-bit signed integer (same as int).',
    'float': 'float\n\nFloating point number.',
    'double': 'double\n\nDouble precision floating point number.',
    'char': 'char\n\nCharacter (8-bit).',
    'byte': 'byte\n\nUnsigned 8-bit integer (0-255).',
    'word': 'word\n\nUnsigned 16-bit integer.',
    'dword': 'dword\n\nUnsigned 32-bit integer.',
    'int64': 'int64\n\n64-bit signed integer.',
    'qword': 'qword\n\nUnsigned 64-bit integer.',
    'boolean': 'boolean\n\nBoolean (true/false).',

    // Data types - CAPL specific
    'message': 'message [id | name];\n\nDeclares a message variable.',
    'signal': 'signal sigName;\n\nDeclares a signal variable.',
    'timer': 'timer [name];\n\nDeclares a timer variable (time in seconds).',
    'Timer': 'Timer timerName;\n\nDeclares a timer variable (time in seconds).',
    'msTimer': 'msTimer timerName;\n\nDeclares a millisecond timer variable.',
    'ms timer': 'msTimer timerName;\n\nDeclares a millisecond timer variable.',
    'mstimer': 'mstimer timerName;\n\nDeclares a millisecond timer variable (alternative syntax).',
    'pdu': 'pdu [name];\n\nDeclares a PDU variable.',
    'envvar': 'envvar name;\n\nDeclares environment variable.',
    'env': 'envvar name;\n\nDeclares environment variable (short form).',
    'sysvar': 'sysvar namespace::name;\n\nDeclares system variable.',
    'sys': 'sysvar namespace::name;\n\nDeclares system variable (short form).',
    '@sysvarMember': '@sysvarMember::Namespace::Variable.Member;\n\nAccesses member of system variable struct.',
    '@sysvarInt': '@sysvarInt::Namespace::Variable;\n\nAccesses as integer.',
    '@sysvarFloat': '@sysvarFloat::Namespace::Variable;\n\nAccesses as float.',
    '@sysvarString': '@sysvarString::Namespace::Variable;\n\nAccesses as string.',
    'msglist': 'msglist name;\n\nDeclares message list.',
    'signallist': 'signallist name;\n\nDeclares signal list.',
    'node': 'node nodeName;\n\nDeclares a node reference.',

    // User-defined types
    'struct': 'struct name { ... }\n\nDefines a structure type.',
    'array': 'array name[size];\n\nDeclares an array variable.',
    'enum': 'enum name { ... }\n\nDefines enumeration type.',
    'enumerates': 'enumerates name { ... }\n\nDefines enumeration type.',
    'typedef': 'typedef oldType newType;\n\nDefines type alias.',

    // Operators
    'sizeof': 'sizeof(variable or type);\n\nReturns size in bytes.',
    'this': 'this\n\nReference to current object.',

    // Values
    'true': 'true\n\nBoolean true value.',
    'false': 'false\n\nBoolean false value.',
    'null': 'null\n\nNull pointer value.',

    // Preprocessor
    'includes': 'includes { ... }\n\nIncludes header files.',
    'define': '#define name value\n\nPreprocessor macro definition.',
    'include': '#include "filename"\n\nIncludes a header file.',

    // Test keywords
    'testcase': 'testcase name { ... }\n\nDefines a test case.',
    'testfunction': 'testfunction name { ... }\n\nDefines a test function.',
    'testgroup': 'testgroup name { ... }\n\nGroups test cases.',
    'teststep': 'teststep(name, "description");\n\nDefines a test step.',
    'testwait': 'testwait(condition, timeout);\n\nWaits for condition with timeout.',
    'testassert': 'testassert(condition, "message");\n\nAsserts condition in test.',

    // CAPL-specific
    'preamble': 'preamble name { ... }\n\nDefines preamble for CAN FD.',
    'attributes': 'attributes name { ... }\n\n\nDefines message attributes.',
    'variables': 'variables { ... }\n\nDeclares global variables section.',

    // Database access
    'diag': 'diag\n\nDiagnostic request type.',
    'DiagRequest': 'DiagRequest(requestName);\n\nCreates diagnostic request object.',
    'DiagResponse': 'DiagResponse(responseName);\n\nCreates diagnostic response object.',

    // IP/Ethernet
    'IP_Endpoint': 'IP_Endpoint(name);\n\nCreates IP endpoint object.',
    'socket': 'socket\n\nSocket handle type.',

    // Signal/Message access
    '$': '$MessageName::SignalName\n\nAccesses signal value from database.\nExample: $EngineData::RPM',
    '@': '@sysvar::Namespace::Variable\n\nAccesses system variable value.\nExample: @sysvar::Engine::Speed'
};

export const CAPL_TYPES = [
    'byte', 'word', 'dword', 'int', 'long', 'int64', 'qword', 'float', 'double', 'char', 'boolean',
    'void', 'message', 'signal', 'timer', 'Timer', 'msTimer', 'mstimer', 'pdu', 'envvar', 'env',
    'sysvar', 'sys', 'msglist', 'signallist', 'node', 'struct', 'array', 'enum', 'enumerates'
];
