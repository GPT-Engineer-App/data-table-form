import React, { useState } from "react";
import { ChakraProvider, Box, VStack, Grid, theme, Table, Thead, Tbody, Tr, Th, Td, FormControl, FormLabel, Input, Button, useToast, Heading } from "@chakra-ui/react";
import { FaSignInAlt } from "react-icons/fa";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [listings, setListings] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://backengine-iux9.fly.dev/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const { accessToken } = await response.json();
      localStorage.setItem("accessToken", accessToken);
      setIsLoggedIn(true);
      fetchListings(accessToken);
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const fetchListings = async (token) => {
    try {
      const response = await fetch("https://backengine-iux9.fly.dev/listings", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Fetching listings failed");
      }
      const data = await response.json();
      setListings(data);
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <VStack spacing={8}>
            <Heading>Interactive API Platform</Heading>
            {!isLoggedIn ? (
              <Box minW={{ base: "90%", md: "468px" }}>
                <form onSubmit={handleLogin}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Password</FormLabel>
                      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </FormControl>
                    <Button leftIcon={<FaSignInAlt />} colorScheme="teal" variant="solid" type="submit">
                      Sign In
                    </Button>
                  </VStack>
                </form>
              </Box>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Title</Th>
                      <Th>Description</Th>
                      {/* Other headers */}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {listings.map((listing, index) => (
                      <Tr key={index}>
                        <Td>{listing.id}</Td>
                        <Td>{listing.title}</Td>
                        <Td>{listing.description}</Td>
                        {/* Other data cells */}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};

export default Index;
