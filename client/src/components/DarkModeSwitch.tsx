import { Flex, HStack, Switch, Text, useColorMode } from '@chakra-ui/react'

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  return (
    <Flex pr={'1rem'} pt={'1rem'} justifyContent={'flex-end'} w={'100%'}>
      <HStack>
        <Text as={'span'}>&#127774;</Text>
        <Switch color="green" isChecked={isDark} onChange={toggleColorMode} />
        <Text as={'span'}>&#127771;</Text>
      </HStack>
    </Flex>
  )
}
