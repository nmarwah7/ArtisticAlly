import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Input, Image, VStack, Text, SimpleGrid, Flex } from '@chakra-ui/react';

const PortfolioManager = ({ userId }) => {
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [portfolios, setPortfolios] = useState([]);
    const [userPortfolio, setUserPortfolio] = useState([]);

    // Handle file change and image preview
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setFile(reader.result); // Base64 image string with prefix
            setImagePreview(URL.createObjectURL(selectedFile));
        };

        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpload = async () => {
        try {
            const base64Image = file; // Already includes 'data:image/jpeg;base64,' prefix
            const response = await axios.post('https://artistically2-b1c26d45fe00.herokuapp.com/portfolio/upload', {
                userId,
                imageBase64: base64Image
            });
            console.log('Image uploaded successfully:', response.data);
            setFile(null);
            setImagePreview(null);
            fetchUserPortfolio(); // Refresh user's portfolio after upload
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    // Fetch user's own portfolio
    const fetchUserPortfolio = async () => {
        try {
            const response = await axios.get('https://artistically2-b1c26d45fe00.herokuapp.com/portfolio/myportfolio', {
                params: { userId }
            });
            setUserPortfolio(response.data);
        } catch (error) {
            console.error('Error fetching user portfolio:', error);
        }
    };

    // Search portfolios based on search term
    const handleSearch = async () => {
        try {
            const response = await axios.get('https://artistically2-b1c26d45fe00.herokuapp.com/portfolio/search', {
                params: { searchTerm }
            });
            setPortfolios(response.data);
        } catch (error) {
            console.error('Error fetching portfolios:', error);
        }
    };

    // Trigger search when search term changes
    useEffect(() => {
        if (searchTerm) {
            handleSearch();
        } else {
            setPortfolios([]);
        }
    }, [searchTerm]);

    // Fetch user portfolio on component mount
    useEffect(() => {
        fetchUserPortfolio();
    }, []);

    return (
        <VStack spacing={6} align="stretch">
            {/* Display User's Portfolio */}
            <Box textAlign="center" mb={4}>
                <Text
                    fontSize="3xl"
                    fontFamily="Montserrat,sans-serif"
                    fontWeight="bold"
                    bg="whiteAlpha.800"  // Slightly transparent white background
                    p={4}
                    borderRadius="50px"
                    boxShadow="md"
                    textAlign="center"
                    alignItems="center"
                    mb={6}
                    mt="20px"
                    width="80%"         // Adjust width as needed
                    mx="auto"          // Center horizontally
                >
                    My Portfolio
                </Text>

            </Box>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {userPortfolio.map((image, index) => (
                    <Flex key={index} justify="center">
                        <Box
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                            p={4}
                            bg="white"
                            shadow="md"
                            maxWidth="300px"
                            w="full"
                        >
                            <Image src={image.ImageData} alt="User Portfolio Image" boxSize="300px" objectFit="cover" />
                        </Box>
                    </Flex>
                ))}
            </SimpleGrid>

            {/* Image Upload Section */}
            <Box textAlign="center" mb={4}>
                <Input type="file" accept="image/*" onChange={handleFileChange} mb={2} style={{ backgroundColor: "white", width: "90%", marginRight: "20px" }} />
                {imagePreview && <Image src={imagePreview} alt="Preview" boxSize="300px" objectFit="cover" mb={2} />}
                <Button onClick={handleUpload} colorScheme="teal" disabled={!file}>Upload</Button>
            </Box>

            {/* Search Section */}
            <Box textAlign="center" mb={4}>
                <Input
                    placeholder="Search for portfolios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    mb={2}
                    style={{ backgroundColor: "white", width: "90%", marginRight: "20px" }}
                />
                <Button onClick={handleSearch} colorScheme="teal">Search</Button>
            </Box>

            {/* Display Portfolios */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {portfolios.map((portfolio) => (
                    <Flex key={portfolio.userId} justify="center">
                        <Box
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                            p={4}
                            bg="white"
                            shadow="md"
                            maxWidth="300px"
                            w="full"
                        >
                            <Text fontWeight="bold" mb={2}>{portfolio.FirstName} {portfolio.LastName}</Text>
                            <Image src={portfolio.ImageData} alt="Portfolio Image" boxSize="300px" objectFit="cover" />
                        </Box>
                    </Flex>
                ))}
            </SimpleGrid>
        </VStack>
    );
};

export default PortfolioManager;
