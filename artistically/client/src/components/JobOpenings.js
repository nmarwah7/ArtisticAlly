import React, { useState, useEffect } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Heading,
    Text,
    Button,
    Stack,
    Image,
    extendTheme,
    ChakraProvider,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from "@chakra-ui/react";
import axios from "axios";

const theme = extendTheme({
    styles: {
        global: {
            body: {
                color: "white",
                bg: "black",
            },
        },
    },
    components: {
        Accordion: {
            baseStyle: {
                container: {
                    borderTopColor: "white",
                },
                button: {
                    color: "white",
                },
                panel: {
                    color: "white",
                },
                icon: {
                    color: "white",
                },
            },
        },
        Box: {
            baseStyle: {
                bg: "whiteAlpha.200",
                borderColor: "white",
            },
        },
        Heading: {
            baseStyle: {
                color: "white",
            },
        },
        Text: {
            baseStyle: {
                color: "white",
            },
        },
        Button: {
            baseStyle: {
                color: "white",
                borderColor: "white",
                _hover: {
                    bg: "whiteAlpha.300",
                },
            },
        },
    },
});

// Utility function to validate URLs
const isValidUrl = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
};

const JobOpenings = () => {
    const [jobsByCategory, setJobsByCategory] = useState({});
    const [newJob, setNewJob] = useState({
        category: "",
        title: "",
        company: "",
        prerequisites: "",
        expectations: "",
        apply_link: "",
    });
    const [showForm, setShowForm] = useState(false);
    const [reportingJobId, setReportingJobId] = useState(null);
    const [reportReason, setReportReason] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        axios.get("https://artistically2-b1c26d45fe00.herokuapp.com/jobs/all").then(response => {
            const jobs = response.data;
            const categorizedJobs = jobs.reduce((acc, job) => {
                if (!acc[job.category]) {
                    acc[job.category] = [];
                }
                acc[job.category].push(job);
                return acc;
            }, {});
            setJobsByCategory(categorizedJobs);
        });
    }, []);

    const handleChange = (e) => {
        setNewJob({
            ...newJob,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValidUrl(newJob.apply_link)) {
            alert("The application link is not valid. Please provide a valid URL.");
            return;
        }

        axios.post("https://artistically2-b1c26d45fe00.herokuapp.com/jobs/add", newJob).then(() => {
            axios.get("https://artistically2-b1c26d45fe00.herokuapp.com/jobs/all").then(response => {
                const jobs = response.data;
                const categorizedJobs = jobs.reduce((acc, job) => {
                    if (!acc[job.category]) {
                        acc[job.category] = [];
                    }
                    acc[job.category].push(job);
                    return acc;
                }, {});
                setJobsByCategory(categorizedJobs);
                setShowForm(false);
            });
        });
    };

    const reportJob = (jobId) => {
        setReportingJobId(jobId);
        setIsModalOpen(true);
    };

    const handleReportSubmit = (e) => {
        e.preventDefault();
        if (!reportingJobId || !reportReason) {
            alert("Please provide a reason for reporting the job.");
            return;
        }

        axios.post("https://artistically2-b1c26d45fe00.herokuapp.com/jobs/report", { jobId: reportingJobId, reason: reportReason })
            .then(() => {
                alert("The job has been reported. We will review it shortly.");
                setIsModalOpen(false);
                setReportingJobId(null);
                setReportReason("");
            })
            .catch(err => {
                console.error("Error reporting the job:", err);
                alert("There was an error reporting the job. Please try again later.");
            });
    };

    return (
        <ChakraProvider theme={theme}>
            <div>
                <Heading
                    fontFamily="Montserrat, sans-serif"
                    fontWeight="bold"
                    fontSize="50px"
                    textAlign="center"
                    mt={8}
                    mb={4}
                >
                    Job Openings
                </Heading>

                <Box p={6}>
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        colorScheme="purple"
                        variant="solid"
                        mb={4}
                    >
                        {showForm ? "Hide Job Form" : "Create a New Job Listing"}
                    </Button>

                    {showForm && (
                        <form onSubmit={handleSubmit}>
                            <FormControl mb={4}>
                                <FormLabel>Category</FormLabel>
                                <Select name="category" onChange={handleChange} required>
                                    <option value="">Select Category</option>
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
                                <Input name="title" onChange={handleChange} required />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Company</FormLabel>
                                <Input name="company" onChange={handleChange} required />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Pre-requisites</FormLabel>
                                <Textarea name="prerequisites" onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Expectations</FormLabel>
                                <Textarea name="expectations" onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Link to Apply</FormLabel>
                                <Input
                                    name="apply_link" // Ensure this matches the state property
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <Button type="submit" colorScheme="purple" variant="solid">
                                Create Job Listing
                            </Button>
                        </form>
                    )}

                    <Accordion allowToggle mt={8}>
                        {Object.keys(jobsByCategory).map((category) => (
                            <AccordionItem key={category}>
                                <h2>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                            <Heading fontSize="xl">{category}</Heading>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <Stack spacing={4}>
                                        {jobsByCategory[category].map((job, index) => (
                                            <Box
                                                key={index}
                                                borderWidth="1px"
                                                borderRadius="lg"
                                                p={4}
                                                display="flex"
                                                alignItems="center"
                                                backgroundColor="whitesmoke"
                                            >
                                                <Image
                                                    src="/LOGO.jpg"
                                                    alt="Company Logo"
                                                    boxSize="150px"
                                                    objectFit="cover"
                                                    mr={4}
                                                />
                                                <Stack flex="1">
                                                    <Stack direction="row" align="center" mb={2}>
                                                        <Heading fontSize="lg" color="black">{job.title}</Heading>
                                                        <Text fontSize="sm" color="gray" ml={2}>
                                                            at {job.company}
                                                        </Text>
                                                    </Stack>
                                                    <Stack spacing={2}>
                                                        <Text color="black">
                                                            <strong>Pre-requisites:</strong>{" "}
                                                            {job.prerequisites}
                                                        </Text>
                                                        <Text color="black">
                                                            <strong>Expectations:</strong>{" "}
                                                            {job.expectations}
                                                        </Text>
                                                        <Text color="black">
                                                            <strong>Apply Here:</strong>{" "}
                                                            <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
                                                                {job.apply_link}
                                                            </a>
                                                        </Text>
                                                    </Stack>
                                                    <Stack mt={4}>
                                                        <Button
                                                            mt={2}
                                                            colorScheme="purple"
                                                            variant="solid"
                                                            width="full"  // Full width of the container
                                                            onClick={() => {
                                                                window.open(job.apply_link, "_blank");
                                                            }}
                                                        >
                                                            Apply for Job
                                                        </Button>
                                                        <Button
                                                            mt={2}
                                                            colorScheme="red"
                                                            variant="outline"
                                                            size="sm"
                                                            width="auto"  // Adjust width to fit content
                                                            ml={2}        // Margin-left for spacing
                                                            onClick={() => reportJob(job.id)}
                                                        >
                                                            Report Suspicious Job
                                                        </Button>

                                                    </Stack>
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Stack>
                                </AccordionPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </Box>

                {/* Report Job Modal */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader color="black">Report Job</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl mb={4}>
                                <FormLabel color="black">Reason for Reporting</FormLabel>
                                <Textarea
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    placeholder="Please provide a reason for reporting this job."
                                    color="black"
                                />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="purple" onClick={handleReportSubmit} mr={3}>
                                Submit
                            </Button>
                            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </ChakraProvider>
    );
};

export default JobOpenings;
