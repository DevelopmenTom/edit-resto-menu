import { Center, Heading, Text } from '@chakra-ui/react'

export const InfoSection = () => {
  return (
    <Center flexDirection={'column'} pt={'2rem'}>
      <Heading py={'5px'} as={'h1'} size={'3xl'}>
        Tom's Diner
      </Heading>
      <Text as={'h2'} size={'xl'}>
        There for ya 24/7 &#127828; &#127859; &#127866;
      </Text>
      <Text as={'i'} size={'xl'}>
        Mockstrasse 6, 10246 Berlin.
      </Text>
    </Center>
  )
}
