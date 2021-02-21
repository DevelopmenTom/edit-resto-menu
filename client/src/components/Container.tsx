import { Flex, FlexProps, useColorMode } from '@chakra-ui/react'

export const Container = (props: FlexProps) => {
  const { colorMode } = useColorMode()

  const bgColor = { dark: 'gray.900', light: 'gray.50' }

  const color = { dark: 'white', light: 'black' }
  return (
    <Flex
      h={'100%'}
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      {...props}
    />
  )
}
