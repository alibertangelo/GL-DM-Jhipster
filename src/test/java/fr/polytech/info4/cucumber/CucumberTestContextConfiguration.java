package fr.polytech.info4.cucumber;

import fr.polytech.info4.CoopCycleApp;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

@CucumberContextConfiguration
@SpringBootTest(classes = CoopCycleApp.class)
@WebAppConfiguration
public class CucumberTestContextConfiguration {}
