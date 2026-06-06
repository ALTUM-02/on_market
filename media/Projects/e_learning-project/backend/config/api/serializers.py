class UploadedFileSerializer(serializers.ModelSerializer):

    file_url = serializers.SerializerMethodField()

    class Meta:
        model = UploadedFile
        fields = [
            'id',
            'file_type',
            'filename',
            'description',
            'folder',
            'file',
            'file_url',
            'created_at',
            'updated_at'
        ]

    def get_file_url(self, obj):

        request = self.context.get('request')

        if obj.file:

            if request:
                return request.build_absolute_uri(
                    obj.file.url
                )

            return obj.file.url

        return None