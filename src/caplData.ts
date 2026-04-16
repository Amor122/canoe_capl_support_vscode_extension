export const CAPL_FUNCTIONS: Record<string, string> = {
    // Output Functions
    'output': 'output(message);\n\nSends a message on the CAN bus.',
    'write': 'write("format", ...);\n\nWrites text to the Write window.',
    'elnl': 'elnl();\n\nWrites a newline to the Write window.',
    'elprintf': 'elprintfex(category, "format", ...);\n\nWrites formatted output to the Write window.',
    'elprintfex': 'elprintfex(category, level, "format", ...);\n\nWrites formatted output with category and level.',

    // Timer Functions
    'setTimer': 'setTimer(timerName, timeInMs);\n\nSets a timer with specified duration in milliseconds.',
    'setTimerSync': 'setTimerSync(timerName, timeInMs);\n\nSets a timer synchronously.',
    'cancelTimer': 'cancelTimer(timerName);\n\nCancels an active timer.',
    'timer': 'timer timerName; or timer timerName(timeInMs);\n\nDeclares a timer variable.',
    'elapsed': 'elapsed(timerName);\n\nReturns elapsed time since timer started.',

    // Value Access Functions
    'putValue': 'putValue(signalOrEnvVar, value);\n\nSets the value of a signal or environment variable.',
    'getValue': 'getValue(signalOrEnvVar);\n\nGets the value of a signal or environment variable.',
    'setWrite': 'setWrite(sysVarPath, value);\n\nSets the value of a system variable.',
    'getSignal': 'getSignal(message, signalName);\n\nGets signal value from a message object.',
    'setSignal': 'setSignal(message, signalName, value);\n\nSets signal value in a message object.',
    'this': 'this\n\nReference to the current message object in event handler.',

    // Message Functions
    'message': 'message messageName or message id;\n\nDeclares a message variable.',
    'onmessage': 'onmessage messageName { ... }\n\nEvent handler for receiving a specific message.',
    'ontimer': 'ontimer timerName { ... }\n\nEvent handler for timer expiration.',
    'onstart': 'onstart() { ... }\n\nEvent handler called when measurement starts.',
    'onstop': 'onstop() { ... }\n\nEvent handler called when measurement stops.',
    'onerror': 'onerror() { ... }\n\nEvent handler for errors.',

    // Test Functions
    'testcase': 'testcase name { ... }\n\nDefines a test case.',
    'testfunction': 'testfunction name { ... }\n\nDefines a test function.',
    'testwait': 'testwait(condition, timeoutMs);\n\nWaits for a condition with timeout.',
    'testassert': 'testassert(condition, "message");\n\nAsserts a condition in test.',
    'teststep': 'teststep(name, "description");\n\nDefines a test step.',
    'testreport': 'testreport(message, result);\n\nReports test result.',
    'testconfig': 'testconfig(name);\n\nSets test configuration.',

    // Math Functions
    'sqrt': 'sqrt(value);\n\nCalculates the square root.',
    'abs': 'abs(value);\n\nCalculates absolute value.',
    'sin': 'sin(angle);\n\nCalculates sine (angle in radians).',
    'cos': 'cos(angle);\n\nCalculates cosine (angle in radians).',
    'tan': 'tan(angle);\n\nCalculates tangent (angle in radians).',
    'asin': 'asin(value);\n\nCalculates arcsine (result in radians).',
    'acos': 'acos(value);\n\nCalculates arccosine (result in radians).',
    'atan': 'atan(value);\n\nCalculates arctangent (result in radians).',
    'atan2': 'atan2(y, x);\n\nCalculates arctangent with quadrant.',
    'log': 'log(value);\n\nCalculates natural logarithm.',
    'log10': 'log10(value);\n\nCalculates base-10 logarithm.',
    'exp': 'exp(value);\n\nCalculates exponential (e^x).',
    'pow': 'pow(base, exponent);\n\nCalculates power (base^exponent).',
    'floor': 'floor(value);\n\nRounds down to integer.',
    'ceil': 'ceil(value);\n\nRounds up to integer.',
    'round': 'round(value);\n\nRounds to nearest integer.',

    // String Functions
    'strlen': 'strlen(string);\n\nReturns the length of a string.',
    'strcpy': 'strcpy(destination, source);\n\nCopies a string.',
    'strcat': 'strcat(destination, source);\n\nConcatenates two strings.',
    'strncpy': 'strncpy(destination, source, count);\n\nCopies specified number of characters.',
    'strncat': 'strncat(destination, source, count);\n\nConcatenates specified number of characters.',
    'strcmp': 'strcmp(string1, string2);\n\nCompares two strings (returns 0 if equal).',
    'strncmp': 'strncmp(string1, string2, count);\n\nCompares first n characters.',
    'strchr': 'strchr(string, character);\n\nFinds first occurrence of character.',
    'strstr': 'strstr(haystack, needle);\n\nFinds substring (returns position or -1).',
    'strrchr': 'strrchr(string, character);\n\nFinds last occurrence of character.',
    'sprintf': 'sprintf(buffer, "format", ...);\n\nFormats and stores string.',
    'sscanf': 'sscanf(string, "format", ...);\n\nParses formatted string.',
    'atoi': 'atoi(string);\n\nConverts string to integer.',
    'atof': 'atof(string);\n\nConverts string to float.',
    'atol': 'atol(string);\n\nConverts string to long integer.',
    'tolower': 'tolower(character);\n\nConverts character to lowercase.',
    'toupper': 'toupper(character);\n\nConverts character to uppercase.',

    // Memory Functions
    'memset': 'memset(buffer, value, size);\n\nFills memory with specified value.',
    'memcpy': 'memcpy(destination, source, size);\n\nCopies memory area.',
    'memcmp': 'memcmp(buffer1, buffer2, size);\n\nCompares memory areas.',
    'memmove': 'memmove(destination, source, size);\n\nMoves memory area (handles overlap).',

    // File Functions
    'filemap': 'filemap(filename);\n\nMaps a file for CAPL access.',
    'fileclose': 'fileclose(fileHandle);\n\nCloses a file.',
    'fileread': 'fileread(fileHandle, buffer, bytesToRead);\n\nReads from file.',
    'filewrite': 'filewrite(fileHandle, buffer, bytesToWrite);\n\nWrites to file.',
    'filegetc': 'filegetc(fileHandle);\n\nGets next character from file.',
    'fileputc': 'fileputc(fileHandle, character);\n\nWrites character to file.',
    'filesetpos': 'filesetpos(fileHandle, position);\n\nSets file position.',
    'filegetpos': 'filegetpos(fileHandle);\n\nGets current file position.',

    // Logging Functions
    'logClose': 'logClose();\n\nCloses the logging block.',
    'logOpen': 'logOpen(filename);\n\nOpens a logging block.',
    'logReset': 'logReset();\n\nResets the logging configuration.',
    'logWrite': 'logWrite(message);\n\nWrites to logging output.',
    'logCreate': 'logCreate(filename, config);\n\nCreates log file with configuration.',

    // PDU Functions
    'triggerPDU': 'triggerPDU(pduObject);\n\nTriggers a PDU to be sent.',
    'GetA664Message': 'GetA664Message(pdu);\n\nGets A664 message from PDU.',
    'GetCANMessage': 'GetCANMessage(pdu);\n\nGets CAN message from PDU.',
    'GetEthernetPacket': 'GetEthernetPacket(pdu);\n\nGets Ethernet packet from PDU.',

    // Hardware Functions
    'GetChannelHardwareMapping': 'GetChannelHardwareMapping(channel, busType);\n\nGets hardware mapping for channel.',
    'InterfaceStatus': 'InterfaceStatus();\n\nCallback for interface status changes.',
    'xlSetLED': 'xlSetLED(device, led, state);\n\nSets LED state on hardware.',
    'xlAcquireLED': 'xlAcquireLED(device, led);\n\nAcquires LED for control.',
    'xlReleaseLED': 'xlReleaseLED(device, led);\n\nReleases LED control.',

    // Panel Functions
    'openPanel': 'openPanel(panelName);\n\nOpens a panel.',
    'closePanel': 'closePanel(panelName);\n\nCloses a panel.',
    'enableControl': 'enableControl(panelName, controlName, enable);\n\nEnables or disables a control.',
    'SetControlProperty': 'SetControlProperty(panelName, controlName, property, value);\n\nSets control property value.',
    'SetControlVisibility': 'SetControlVisibility(panelName, controlName, visible);\n\nSets control visibility.',
    'SetControlBackColor': 'SetControlBackColor(panelName, controlName, color);\n\nSets control background color.',
    'SetControlForeColor': 'SetControlForeColor(panelName, controlName, color);\n\nSets control text color.',
    'putValueToControl': 'putValueToControl(panelName, controlName, value);\n\nSets value of CAPL Output View control.',
    'SetClockControlTime': 'SetClockControlTime(panelName, controlName, time);\n\nSets time of clock control.',
    'ClockControlStart': 'ClockControlStart(panelName, controlName);\n\nStarts clock control.',
    'ClockControlStop': 'ClockControlStop(panelName, controlName);\n\nStops clock control.',
    'ClockControlReset': 'ClockControlReset(panelName, controlName);\n\nResets clock control.',

    // Byte Swapping Functions
    'swapWord': 'swapWord(value);\n\nSwaps bytes of 16-bit value (Intel <-> Motorola).',
    'swapInt': 'swapInt(value);\n\nSwaps bytes of 32-bit integer.',
    'swapInt64': 'swapInt64(value);\n\nSwaps bytes of 64-bit integer.',
    'swapLong': 'swapLong(value);\n\nSwaps bytes of long value.',
    'swapDWord': 'swapDWord(value);\n\nSwaps bytes of double word.',
    'swapQWord': 'swapQWord(value);\n\nSwaps bytes of quad word.',

    // CAN Functions
    'canWrite': 'canWrite(msgId, data, dlc);\n\nWrites CAN message to bus.',
    'canRead': 'canRead(msgId);\n\nReads CAN message from bus.',
    'canPeek': 'canPeek(msgId);\n\nPeeks at CAN message without consuming.',
    'canClear': 'canClear(msgId);\n\nClears CAN message queue.',

    // Database Functions
    'dbGetSymbol': 'dbGetSymbol(name);\n\nGets symbol from database.',
    'dbGetMessage': 'dbGetMessage(msgName);\n\nGets message from database.',
    'dbGetSignal': 'dbGetSignal(sigName);\n\nGets signal from database.',

    // System Variable Functions
    'sysvar': 'sysvar namespace::variableName;\n\nDeclares a system variable.',
    'sysvarGet': 'sysvarGet(path);\n\nGets system variable value.',
    'sysvarSet': 'sysvarSet(path, value);\n\nSets system variable value.',
    'sysvarSetSync': 'sysvarSetSync(path, value);\n\nSets system variable value synchronously.',

    // Event Functions
    'onkey': 'onkey(keyCode) { ... }\n\nEvent handler for key press.',
    'onmouse': 'onmouse(x, y) { ... }\n\nEvent handler for mouse action.',
    'onmessageEx': 'onmessageEx(msgId, dir) { ... }\n\nEvent handler for extended message.',
    'onpretrigger': 'onpretrigger() { ... }\n\n\nEvent handler called before trigger.',
    'ontrigger': 'ontrigger() { ... }\n\nEvent handler for trigger.',

    // Check Functions
    'check': 'check(condition);\n\nChecks condition and reports result.',
    'checkContains': 'checkContains(actual, expected);\n\nChecks if actual contains expected.',
    'checkEquals': 'checkEquals(actual, expected);\n\nChecks if values are equal.',

    // Stub and Mock Functions
    'stub': 'stub(functionName);\n\nCreates a stub for a function.',
    'expect': 'expect(functionCall, returnValue);\n\nSets expected return value for mock.',
    'mock': 'mock(functionName);\n\nCreates mock for function.',
    'verify': 'verify(mockFunction);\n\nVerifies mock was called.',

    // Time Functions
    'time': 'time();\n\nReturns current measurement time.',
    'sleep': 'sleep(delayMs);\n\nSuspends execution for specified time.',
    'getLocalTime': 'getLocalTime();\n\nGets current local time.',

    // Conversion Functions
    'hex': 'hex(value);\n\nConverts to hexadecimal string.',
    'dec': 'dec(value);\n\nConverts to decimal string.',
    'floatToInt': 'floatToInt(value);\n\nConverts float to integer bits.',
    'intToFloat': 'intToFloat(value);\n\nConverts integer bits to float.',

    // Miscellaneous
    'MakeRGB': 'MakeRGB(red, green, blue);\n\nCreates RGB color value.',
    'MakeARGB': 'MakeARGB(alpha, red, green, blue);\n\nCreates ARGB color value.',
    'SetMeanRange': 'SetMeanRange(panel, control, min, max);\n\nSets mean range for control.',
    'SetMinMax': 'SetMinMax(panel, control, min, max);\n\nSets minimum and maximum for control.',
    'SetPictureBoxImage': 'SetPictureBoxImage(panel, control, imagePath);\n\nSets image for picture box control.',
    'SetMediaFile': 'SetMediaFile(panel, control, mediaPath);\n\nSets media file for control.',
    'SetMediaStream': 'SetMediaStream(panel, control, streamIndex);\n\nSets media stream for control.'
};

export const CAPL_KEYWORDS = [
    'if', 'else', 'switch', 'case', 'default', 'while', 'do', 'for', 'break', 'continue', 'return', 'goto',
    'const', 'volatile', 'extern', 'static', 'void', 'int', 'long', 'float', 'double', 'char', 'byte', 'word',
    'dword', 'int64', 'qword', 'boolean', 'enumerates', 'struct', 'array', 'message', 'signal', 'timer',
    'envvar', 'msglist', 'signallist', 'sysvar', 'node', 'on', 'onmessage', 'ontimer', 'onstart', 'onstop',
    'onerror', 'onkey', 'onmouse', 'onpretrigger', 'ontrigger', 'this', 'sizeof', 'typedef', 'union',
    'enum', 'return', 'null', 'true', 'false'
];

export const CAPL_TYPES = [
    'byte', 'word', 'dword', 'int', 'long', 'int64', 'qword', 'float', 'double', 'char', 'boolean',
    'void', 'message', 'signal', 'timer', 'envvar', 'sysvar', 'enumerates', 'struct', 'array'
];
