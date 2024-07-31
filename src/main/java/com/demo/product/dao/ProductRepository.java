package com.demo.product.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.product.dto.ProductEntity;

public interface ProductRepository extends JpaRepository<ProductEntity, String>{
	@Override
	Page<ProductEntity> findAll(Pageable pageable);
}
