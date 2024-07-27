import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardBody,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    Textarea,
    useDisclosure,
    useToast,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    extendTheme,
    ChakraProvider,
    Select,
} from '@chakra-ui/react';
import axios from 'axios';

const theme = extendTheme({
    styles: {
        global: {
            body: {
                color: 'white',
                bg: 'black',
            },
        },
    },
});

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
};

const validateURL = (url) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-zA-Z0-9\\-\\.]+)\\.([a-zA-Z]{2,4})|[a-zA-Z0-9\\-\\.]+\\.[a-zA-Z]{2,4}|localhost|127\\.0\\.0\\.1|::1)' + // domain name
        '|([0-9a-fA-F:]{1,39}))' + // IPv4/IPv6
        '(\\:\\d+)?(\\/[-a-zA-Z0-9%_\\+.~#]*)*' + // port and path
        '(\\?[;&a-zA-Z0-9%_\\+.~#=-]*)?' + // query string
        '(#[-a-zA-Z0-9_]*)?$', 'i'); // fragment locator
    return pattern.test(url);
};

const validateTime = (timeStr) => {
    const pattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return pattern.test(timeStr);
};

const EventsDiscovery = () => {
    const [eventsByCategory, setEventsByCategory] = useState({});
    const [newEvent, setNewEvent] = useState({
        category: '',
        title: '',
        description: '',
        event_date: '',
        event_time: '',
        place: '',
        rsvp_link: '',
    });
    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        axios.get('https://artistically2-b1c26d45fe00.herokuapp.com/events/all')
            .then(response => {
                const events = response.data;
                const categorizedEvents = events.reduce((acc, event) => {
                    if (!acc[event.category]) acc[event.category] = [];
                    acc[event.category].push(event);
                    return acc;
                }, {});
                setEventsByCategory(categorizedEvents);
            })
            .catch(error => console.error('Error fetching events:', error));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = () => {
        if (!validateURL(newEvent.rsvp_link)) {
            toast({
                title: 'Invalid URL.',
                description: 'The RSVP link is not valid. Please enter a valid URL.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!validateTime(newEvent.event_time)) {
            toast({
                title: 'Invalid Time Format.',
                description: 'The time should be in HH:MM format.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        axios.post('https://artistically2-b1c26d45fe00.herokuapp.com/events/add', newEvent)
            .then(response => {
                toast({
                    title: 'Event posted.',
                    description: 'Your event has been successfully posted.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setNewEvent({
                    category: '',
                    title: '',
                    description: '',
                    event_date: '',
                    event_time: '',
                    place: '',
                    rsvp_link: '',
                });
                setShowForm(false);
                onClose();
                fetchEvents();
            })
            .catch(error => {
                console.error('Error posting event:', error);
                toast({
                    title: 'An error occurred.',
                    description: 'Unable to post the event. Please try again later.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            });
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading fontFamily='Montserrat, sans-serif' fontWeight='bold' color='white' fontSize='50px' textAlign='center' mt={8} mb={4}>
                    Events
                </Heading>
                <Button onClick={() => { setShowForm(true); onOpen(); }} colorScheme='purple' mb={4}>
                    Post Your Own Event!
                </Button>
                <Tabs variant='soft-rounded'>
                    <TabList bg='purple.200' borderRadius='xl' p={4} mb={4}>
                        {Object.keys(eventsByCategory).map((category, index) => (
                            <Tab
                                key={index}
                                _selected={{ color: 'white', bg: 'purple.700' }}
                                _focus={{ boxShadow: 'none' }}
                                _hover={{ bg: 'purple.500' }}
                                mr={2}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </Tab>
                        ))}
                    </TabList>
                    <TabPanels>
                        {Object.keys(eventsByCategory).map((category, index) => (
                            <TabPanel key={index}>
                                <div>
                                    {eventsByCategory[category]?.length > 0 ? (
                                        eventsByCategory[category].map((event, i) => (
                                            <Card
                                                key={i}
                                                direction={{ base: 'column', sm: 'row' }}
                                                overflow='hidden'
                                                variant='elevated'
                                                bg="rgba(255, 255, 255, 0.8)"
                                                maxW="97%"
                                                padding="20px"
                                                borderRadius={"50px"}
                                                mb={4}
                                                color="black"
                                            >
                                                <Stack>
                                                    <CardBody padding="10px">
                                                        <Heading size='lg'>{event.title}</Heading>
                                                        <Text py='4' fontSize="18px" fontFamily={'Montserrat, sans-serif'} fontWeight={"500"}>
                                                            {event.description}
                                                        </Text>
                                                        <Text fontSize="16px" fontFamily={'Montserrat, sans-serif'} fontWeight={"500"}>
                                                            <strong>Date:</strong> {formatDate(event.event_date)}
                                                        </Text>
                                                        <Text fontSize="16px" fontFamily={'Montserrat, sans-serif'} fontWeight={"500"}>
                                                            <strong>Time:</strong> {event.event_time}
                                                        </Text>
                                                        <Text fontSize="16px" fontFamily={'Montserrat, sans-serif'} fontWeight={"500"}>
                                                            <strong>Place:</strong> {event.place}
                                                        </Text>
                                                        <Link href={event.rsvp_link} color='purple.500' isExternal>
                                                            RSVP Here
                                                        </Link>
                                                    </CardBody>
                                                </Stack>
                                            </Card>
                                        ))
                                    ) : (
                                        <h3 style={{ color: 'white' }}>No events scheduled.</h3>
                                    )}
                                </div>
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader color="black">Create New Event</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody color="black">
                            <FormControl mb={4}>
                                <FormLabel>Category</FormLabel>
                                <Select name="category" value={newEvent.category} onChange={handleChange} placeholder="Select Category">
                                    <option value="Dance">Dance</option>
                                    <option value="Music - Classical">Music - Classical</option>
                                    <option value="Music - Contemporary">Music - Contemporary</option>
                                    <option value="Visual Art">Visual Art</option>
                                    <option value="Theatre">Theatre</option>
                                    <option value="Film & Literature">Film & Literature</option>
                                </Select>
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Title</FormLabel>
                                <Input name="title" value={newEvent.title} onChange={handleChange} placeholder="Event Title" />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Description</FormLabel>
                                <Textarea name="description" value={newEvent.description} onChange={handleChange} placeholder="Event Description" />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Date</FormLabel>
                                <Input name="event_date" type="date" value={newEvent.event_date} onChange={handleChange} placeholder="Event Date" />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Time (HH:MM)</FormLabel>
                                <Input name="event_time" value={newEvent.event_time} onChange={handleChange} placeholder="Event Time (HH:MM)" />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Place</FormLabel>
                                <Input name="place" value={newEvent.place} onChange={handleChange} placeholder="Event Place" />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>RSVP Link</FormLabel>
                                <Input name="rsvp_link" value={newEvent.rsvp_link} onChange={handleChange} placeholder="RSVP Link" />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                                Submit
                            </Button>
                            <Button variant='ghost' onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </ChakraProvider>
    );
};

export default EventsDiscovery;
