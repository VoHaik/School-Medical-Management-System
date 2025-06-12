package com.swp391_8.schoolhealth.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.time.LocalDate;

public class FileUtil {

    public static void generateFile() { // Made the method static for easier access
        String fileName = "generated_document.txt";
        // This path creates the directory in the root of the 'backend' module
        // Adjust if you want it relative to the overall project root or another specific location
        String directoryName = "generated_files"; 

        Path dirPath = Paths.get(directoryName); // By default, relative to the working directory (backend module root)
        Path filePath = dirPath.resolve(fileName);

        try {
            // Create the directory if it doesn't already exist
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
                System.out.println("Directory created: " + dirPath.toAbsolutePath());
            }

            // Define the content to be written to the file
            List<String> lines = Arrays.asList(
                "Hello, this is a generated file.",
                "This file was generated on: " + LocalDate.now(),
                "This is some sample content."
            );

            // Write the lines to the file. This will create the file if it doesn't exist,
            // or overwrite it if it does.
            Files.write(filePath, lines, StandardCharsets.UTF_8);

            System.out.println("File generated successfully at: " + filePath.toAbsolutePath());

        } catch (IOException e) {
            System.err.println("An error occurred while generating the file: " + e.getMessage());
            // In a real application, you might want to log this error or throw a custom exception
            // e.printStackTrace(); 
        }
    }

    // Example of how to call it (e.g., from a main method in another class for testing)
    // public static void main(String[] args) {
    //     generateFile();
    // }
}
