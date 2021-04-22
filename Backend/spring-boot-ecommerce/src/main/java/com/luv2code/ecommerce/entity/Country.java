package com.luv2code.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sun.xml.bind.v2.TODO;
import lombok.Getter;
import lombok.Setter;


import javax.persistence.*;
import java.util.List;

@Entity
@Table(name="country")
@Getter
@Setter
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name="code")
    private String code;

    @Column(name="name")
    private String name;

    //TODO : Set up our one-to-many with states
    @OneToMany(mappedBy = "country")
    @JsonIgnore
    private List<State> states;

}
