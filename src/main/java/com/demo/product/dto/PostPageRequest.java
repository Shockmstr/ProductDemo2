package com.demo.product.dto;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PostPageRequest implements Pageable{
	
	private int limit;
	
	private int offset;
	
	private final Sort sort;
	
	public PostPageRequest (int limit, int offset) {
		this.limit = limit;
		this.offset = offset;
		this.sort = Sort.unsorted();
	}

	@Override
	public int getPageNumber() {
		return offset / limit;
	}

	@Override
	public int getPageSize() {
		return limit;
	}

	@Override
	public long getOffset() {
		return offset;
	}

	@Override
	public Sort getSort() {
		return sort;
	}

	@Override
	public Pageable next() {
		return new PostPageRequest(getPageSize(), (int) (getOffset() + getPageSize()));
	}
	
	public Pageable previous() {
		return hasPrevious() ? new PostPageRequest(getPageSize(), (int) (getOffset() - getPageSize())) : this;
	}

	@Override
	public Pageable previousOrFirst() {
		return hasPrevious() ? previous() : first();
	}

	@Override
	public Pageable first() {
		return new PostPageRequest(getPageSize(), 0);
	}

	@Override
	public Pageable withPage(int pageNumber) {
		return new PostPageRequest(getPageSize(), pageNumber + getPageSize());
	}

	@Override
	public boolean hasPrevious() {
		return offset > limit;
	}

}
