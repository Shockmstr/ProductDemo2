package com.demo.product.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.demo.product.dao.ProductRepository;
import com.demo.product.dto.PostPageRequest;
import com.demo.product.dto.ProductEntity;

@RestController
@RequestMapping("/products")
public class ProductController {

	private final ProductRepository productRepository;
	
	public ProductController(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}
	
	@GetMapping("/all")
	public List<ProductEntity> getAll() {
		return productRepository.findAll();
	}
	
	@GetMapping("/{code}")
	public ProductEntity getProduct(@PathVariable String code) {
		return productRepository.findById(code).orElseThrow(() -> new RuntimeException());
	}
	
	@GetMapping
	public List<ProductEntity> getProductInPage(@RequestParam int page, @RequestParam int size) {
		int offset = (page - 1) * size + 0;
		Pageable postPage = new PostPageRequest(size, offset);
		Page<ProductEntity> productPage = productRepository.findAll(postPage);
		return productPage.getContent();
	}
	
	@GetMapping("/pages")
	public int getTotalPages(@RequestParam int size) {
		Pageable postPage = new PostPageRequest(size, 0);
		Page<ProductEntity> productPage = productRepository.findAll(postPage);
		return productPage.getTotalPages();
	}
	
	@PostMapping
	public ProductEntity createProduct(@RequestBody ProductEntity entity) {
		ProductEntity savedEntity = productRepository.save(entity);
		return savedEntity;
	}
	
	@PutMapping("/{code}")
	public ProductEntity editProduct(@PathVariable String code, @RequestBody ProductEntity entity) {
		ProductEntity savedEntity = productRepository.findById(code).orElseThrow(() -> new RuntimeException());
		savedEntity.setBrand(entity.getBrand());
		savedEntity.setCategory(entity.getCategory());
		savedEntity.setDescription(entity.getDescription());
		savedEntity.setName(entity.getName());
		savedEntity.setType(entity.getType());
		
		savedEntity = productRepository.save(entity);
		
		return savedEntity;
	}
	
	@DeleteMapping("/{code}")
	public ResponseEntity<String> deleteProduct(@PathVariable String code) {
		productRepository.deleteById(code);
		return ResponseEntity.ok().build();
	}
	
}
