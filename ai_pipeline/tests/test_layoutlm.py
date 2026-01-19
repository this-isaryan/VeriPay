from ai_pipeline.advanced.layoutlm_features import extract_layoutlm_embedding


vec = extract_layoutlm_embedding("sample_invoices/a99.pdf")

print("Embedding shape:", vec.shape)
print("First 10 values:", vec[:10])
